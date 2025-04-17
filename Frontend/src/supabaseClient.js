// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ignhwqgpjcbddedvvdym.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlnbmh3cWdwamNiZGRlZHZ2ZHltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQzMzQzMDIsImV4cCI6MjA1OTkxMDMwMn0.pCNpehukqdors7BwtZpW2hTqJjEstgW9wbaEy4p9R2U'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
