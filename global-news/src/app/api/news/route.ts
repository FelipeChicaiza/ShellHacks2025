import { NextRequest, NextResponse } from 'next/server';
import { agentManager } from '../../../agents/AgentManager';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get('city') || 'Miami';
    const country = searchParams.get('country') || 'United States';
    const limit = parseInt(searchParams.get('limit') || '20');
    const credibilityThreshold = parseInt(searchParams.get('credibilityThreshold') || '0');

    // Get processed news from agent manager
    const news = agentManager.getNews({
      location: city,
      limit,
      credibilityThreshold
    });

    // If no news exists, trigger the pipeline to fetch some
    if (news.length === 0) {
      console.log('No news found, triggering fetch pipeline...');
      const result = await agentManager.startNewsProcessingPipeline({ city, country });
      
      if (result.success && result.articles) {
        return NextResponse.json({
          success: true,
          data: result.articles,
          message: `Fetched ${result.articles.length} new articles`,
          stats: agentManager.getDatabaseStats()
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: news,
      message: `Retrieved ${news.length} articles`,
      stats: agentManager.getDatabaseStats()
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      data: []
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { city, country, action } = await request.json();

    if (action === 'fetch') {
      // Manually trigger news fetching
      const result = await agentManager.startNewsProcessingPipeline({ 
        city: city || 'Miami', 
        country: country || 'United States' 
      });

      return NextResponse.json(result);
    }

    if (action === 'start-auto') {
      // Start automatic processing
      const intervalMinutes = 10; // Fetch every 10 minutes
      agentManager.startAutomaticProcessing({ 
        city: city || 'Miami', 
        country: country || 'United States' 
      }, intervalMinutes);

      return NextResponse.json({
        success: true,
        message: `Started automatic processing for ${city}, ${country}`,
        interval: intervalMinutes
      });
    }

    if (action === 'stop-auto') {
      // Stop automatic processing
      agentManager.stopAutomaticProcessing();

      return NextResponse.json({
        success: true,
        message: 'Stopped automatic processing'
      });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}