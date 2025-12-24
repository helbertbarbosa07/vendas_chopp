import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  try {
    const db = neon(process.env.NEON_CONNECTION_STRING);

    const result = await db`SELECT 1 AS ok`;

    res.status(200).json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      envExists: !!process.env.NEON_CONNECTION_STRING
    });
  }
}
