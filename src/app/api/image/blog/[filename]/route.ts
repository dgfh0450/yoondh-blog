import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { pathname } = new URL(req.url);
    const filename = pathname.split('/').pop();

    console.log(filename);

    const baseUrl = process.env.IMAGE_SERVER_BLOG_URL;

    try {
        if(!baseUrl) return;
        const url = `${baseUrl}/${filename}`;
        console.log(url);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('이미지 요청 실패');
        }

        const imageBuffer = await response.arrayBuffer();
        return new NextResponse(imageBuffer, {
            status: response.status,
            headers: {
                'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
            },
        });
    } catch (error) {
        console.error('이미지 처리 오류:', error);
        return NextResponse.json({ message: '이미지 처리 오류' }, { status: 500 });
    }
}
