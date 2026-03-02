import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const { to, subject, message } = await req.json()

        console.log("anh yeu em")

       
        const payload = await getPayload({
            config: configPromise,
        })

        await payload.sendEmail({
            to,
            subject,
            html: `<p>${message}</p>`,
        })

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('Email API Error:', error)
        return NextResponse.json(
            { success: false, error: error.message || 'Send email failed' },
            { status: 500 }
        )
    }
}