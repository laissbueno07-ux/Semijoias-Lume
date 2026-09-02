// ============================================================
// Cliente Supabase — usado por cadastro.html e login.html
// ============================================================
// 1. Cole abaixo o Project URL e a anon public key que você
//    copiou em Project Settings > API no painel do Supabase.
// 2. Este arquivo precisa ser carregado ANTES do <script> que
//    faz o cadastro/login em cada página (veja os exemplos).
// ============================================================

const SUPABASE_URL = "https://ysjduulagngeeetwmieu.supabase.co"; 
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlzamR1dWxhZ25nZWVldHdtaWV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNDE0OTUsImV4cCI6MjEwMzgxNzQ5NX0.lJuskA5nNoyQKNr97_TQ9a0Ktz8jb84CDe5D-7jhlpc";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);