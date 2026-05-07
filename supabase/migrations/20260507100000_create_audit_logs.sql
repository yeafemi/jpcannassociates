-- Create the audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    action_type TEXT NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE', 'ROLE_CHANGE'
    resource_type TEXT NOT NULL, -- 'training', 'portfolio', 'blog', 'user', etc.
    resource_name TEXT, -- The name or title of the item changed
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow Admins to view all logs
CREATE POLICY "Admins can view all audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Allow Editors to view audit logs (optional, usually good for transparency)
CREATE POLICY "Editors can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'editor'));

-- No one can update or delete logs
-- (Policies for UPDATE and DELETE are omitted, effectively denying them)

-- Create a view for easier display with user names
CREATE OR REPLACE VIEW public.audit_logs_with_users AS
SELECT 
    al.*,
    p.display_name as user_name
FROM public.audit_logs al
LEFT JOIN public.profiles p ON al.user_id = p.user_id;
