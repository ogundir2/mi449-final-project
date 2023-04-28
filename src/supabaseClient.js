import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kjsdenfopcrfgpljucbq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtqc2RlbmZvcGNyZmdwbGp1Y2JxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODI2NDM3NjIsImV4cCI6MTk5ODIxOTc2Mn0.l54MSsUirQCSgW-7iU6HiXNAnwcNs5u_BVqFKJ9ODJ8";

export const supabase = createClient(supabaseUrl, supabaseKey);