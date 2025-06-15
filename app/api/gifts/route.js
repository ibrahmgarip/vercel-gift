import { NextResponse } from 'next/server';
import pool from '@/lib/db'; // @/ kısayolu lib klasörünü işaret eder

// GET isteğine cevap veren fonksiyon
export async function GET(request) {
  try {
    // Veritabanından tüm hediyeleri çek
    const result = await pool.query('SELECT * FROM gifts ORDER BY created_at DESC');

    // Sonuçları JSON formatında ve 200 (OK) koduyla döndür
    return NextResponse.json(result.rows, { status: 200 });

  } catch (error) {
    console.error('API Error:', error);
    // Hata durumunda 500 (Internal Server Error) koduyla bir mesaj döndür
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

