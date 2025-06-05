# User Data Isolation Implementation Guide

This guide ensures that users can only see their own data when they log into your application.

## 1. Database Setup (Supabase)

### Step 1: Run the SQL Script

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/gpvfafhxcencrgsvbcko
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase_user_isolation_setup.sql`
4. Click **Run** to execute the script

### Step 2: Customize for Your Tables

Replace the example tables (`profiles`, `user_data`) with your actual table names. For each table that should be user-specific:

```sql
-- For each of your tables, add a user_id column and enable RLS
ALTER TABLE your_table_name ADD COLUMN user_id UUID REFERENCES auth.users(id);
ALTER TABLE your_table_name ENABLE ROW LEVEL SECURITY;

-- Create policies for each table
CREATE POLICY "Users can view own records" ON your_table_name
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own records" ON your_table_name
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own records" ON your_table_name
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own records" ON your_table_name
    FOR DELETE USING (auth.uid() = user_id);
```

## 2. Frontend Implementation

### Step 1: Update Your Authentication Context

Ensure your `UserContext.tsx` properly handles user sessions:

```typescript
// In your UserContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface User {
  id: string;
  email: string;
  // Add other user properties
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
```

### Step 2: Protect Your Routes

Add route protection to ensure only authenticated users can access protected pages:

```typescript
// Create a ProtectedRoute component
import { useUser } from "@/components/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

### Step 3: Update Your Data Fetching

Ensure all data queries automatically filter by user:

```typescript
// Example: Fetching user-specific data
import { supabase } from "@/lib/supabase";
import { useUser } from "@/components/UserContext";

export function useUserData() {
  const { user } = useUser();
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      // RLS automatically filters by user_id
      const { data, error } = await supabase
        .from("your_table_name")
        .select("*");

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      setData(data);
    };

    fetchData();
  }, [user]);

  return data;
}
```

## 3. Security Best Practices

### 1. Always Use RLS

- Enable Row Level Security on ALL user tables
- Never rely on frontend filtering alone
- Test policies thoroughly

### 2. Validate User Context

```typescript
// Always check if user is authenticated before operations
const { user } = useUser();
if (!user) {
  throw new Error("User not authenticated");
}
```

### 3. Server-Side Validation

For API routes, always validate the user:

```typescript
// In your API routes
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const supabase = createServerSupabaseClient({ req: request });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Proceed with user-specific operations
}
```

## 4. Testing User Isolation

### Test Checklist:

1. ✅ Create two test accounts
2. ✅ Log in as User A, create some data
3. ✅ Log out and log in as User B
4. ✅ Verify User B cannot see User A's data
5. ✅ Create data as User B
6. ✅ Log back in as User A
7. ✅ Verify User A only sees their own data

### SQL Test Queries:

```sql
-- Test RLS is working (run as different users)
SELECT * FROM your_table_name; -- Should only return current user's data

-- Verify policies exist
SELECT * FROM pg_policies WHERE tablename = 'your_table_name';
```

## 5. Common Issues and Solutions

### Issue: Users can see all data

**Solution**: Ensure RLS is enabled and policies are correctly applied

### Issue: Users can't insert data

**Solution**: Check INSERT policies and ensure user_id is being set correctly

### Issue: Authentication not persisting

**Solution**: Verify session handling in your UserContext

## 6. Migration for Existing Data

If you have existing data without user_id:

```sql
-- Add user_id to existing tables
ALTER TABLE existing_table ADD COLUMN user_id UUID REFERENCES auth.users(id);

-- You'll need to manually assign user_ids to existing records
-- or delete existing data if it's test data
```

This implementation ensures complete data isolation between users while maintaining a smooth user experience.
