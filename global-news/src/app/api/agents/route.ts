import { NextResponse } from 'next/server';
import { agentManager } from '../../../agents/AgentManager.js';

export async function GET() {
  try {
    // Get comprehensive transparency report
    const transparencyReport = agentManager.getTransparencyReport();
    const databaseStats = agentManager.getDatabaseStats();

    return NextResponse.json({
      success: true,
      transparency: transparencyReport,
      database: databaseStats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Agents API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}