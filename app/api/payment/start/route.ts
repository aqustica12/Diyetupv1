import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('Frontend isteği:', body);
    
    // Backend'e proxy yap
    const response = await fetch('http://localhost:5000/api/payment/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });
    
    console.log('Backend response status:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('Backend response data:', data);
      return NextResponse.json(data);
    } else {
      const errorText = await response.text();
      console.error('Backend error:', errorText);
      return NextResponse.json(
        { success: false, error: errorText }, 
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('API Proxy Error:', error);
    return NextResponse.json(
      { success: false, error: 'Backend bağlantı hatası: ' + error.message }, 
      { status: 500 }
    );
  }
} 