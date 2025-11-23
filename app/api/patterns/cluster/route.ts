import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { clusterIncidents } from '@/lib/clustering';
import { loadCachedEmbeddings, saveCachedEmbeddings } from '@/lib/clustering/embeddings';
import { loadCachedTranslations, saveCachedTranslations } from '@/lib/clustering/translation';
import type { Incident, Pattern, ClusteringOptions } from '@/lib/clustering';

export async function POST(request: NextRequest) {
  try {
    // Return mocked pattern data immediately
    console.log('=== RETURNING MOCKED PATTERN DATA ===');
    
    const mockPatterns: Pattern[] = [
      {
        id: "1b1e5302-4ac9-4ef9-861b-858460aa12d1",
        title: "Peak-Hour Overcrowding",
        description: "Customers frequently report severe overcrowding on morning trains, especially between major transfer stations.",
        priority: 1,
        frequency: 34,
        incidentIds: [],
        timeRangeStart: "07:00",
        timeRangeEnd: "09:30"
      },
      {
        id: "c8c8c165-df9a-4a6e-9e3c-e63ab8c34b84",
        title: "Air Conditioning Inefficiency",
        description: "Repeated complaints about insufficient cooling in older train cars during afternoon heat.",
        priority: 2,
        frequency: 18,
        incidentIds: [],
        timeRangeStart: "14:00",
        timeRangeEnd: "17:00"
      },
      {
        id: "7b99f6fe-656d-4b75-b5f8-b4ef67bf2354",
        title: "Platform Delay Confusion",
        description: "Passengers frequently mention unclear or delayed announcements when trains are late.",
        priority: 1,
        frequency: 29,
        incidentIds: [],
        timeRangeStart: "16:00",
        timeRangeEnd: "19:00"
      },
      {
        id: "6630e8e0-8e27-47cd-9315-dab988d391b7",
        title: "Train Door Malfunctions",
        description: "Feedback highlights recurring issues with doors not closing properly, causing service delays.",
        priority: 2,
        frequency: 11,
        incidentIds: [],
        timeRangeStart: "10:00",
        timeRangeEnd: "12:00"
      },
      {
        id: "5a8188b6-21c9-4a69-b336-04d4f3b3ea45",
        title: "Clogged Station Entrances",
        description: "Many customers report bottlenecks at turnstiles during evening rush due to slow ticket validation.",
        priority: 3,
        frequency: 22,
        incidentIds: [],
        timeRangeStart: "17:00",
        timeRangeEnd: "19:00"
      },
      {
        id: "86b6b401-0f95-4f26-9c68-27a1f3978e73",
        title: "Noise Complaints in Tunnels",
        description: "Passengers consistently mention high noise levels when trains accelerate inside long tunnels.",
        priority: 4,
        frequency: 14,
        incidentIds: [],
        timeRangeStart: "08:00",
        timeRangeEnd: "18:00"
      },
      {
        id: "c15c80cd-9ee2-44a8-b737-c54587a40cd3",
        title: "Insufficient Accessibility Support",
        description: "Feedback identifies difficulty accessing elevators and ramps, especially for elderly passengers.",
        priority: 1,
        frequency: 16,
        incidentIds: [],
        timeRangeStart: "09:00",
        timeRangeEnd: "13:00"
      },
      {
        id: "d0752189-4af7-4cf7-8cb6-71c142fe3ecc",
        title: "Frequent Wi-Fi Dropouts",
        description: "Passengers report unstable Wi-Fi signals inside underground sections.",
        priority: 5,
        frequency: 27,
        incidentIds: [],
        timeRangeStart: "06:00",
        timeRangeEnd: "22:00"
      },
      {
        id: "b209858a-00d0-4db8-8af9-344b927b07f5",
        title: "Unexpected Train Stops",
        description: "Many feedback entries mention trains halting between stations without explanations.",
        priority: 2,
        frequency: 9,
        incidentIds: [],
        timeRangeStart: "12:00",
        timeRangeEnd: "14:00"
      },
      {
        id: "cc1e1e1e-7a75-4a38-ad1d-3c08ad0b64c7",
        title: "Crowded Transfer Corridors",
        description: "Passengers complain about high congestion in large interchange stations.",
        priority: 3,
        frequency: 31,
        incidentIds: [],
        timeRangeStart: "17:00",
        timeRangeEnd: "20:00"
      },
      {
        id: "59fdd703-3148-48c1-a2a4-e95ce15723cf",
        title: "Ticket Machine Failures",
        description: "Frequent customer reports of card readers failing or not accepting payments.",
        priority: 2,
        frequency: 13,
        incidentIds: [],
        timeRangeStart: "07:00",
        timeRangeEnd: "10:00"
      },
      {
        id: "f1a0cb8c-ebd9-4b4b-a411-684c357ff446",
        title: "Station Lighting Issues",
        description: "Feedback indicates dim or non-functional lights in older stations, affecting perceived safety.",
        priority: 4,
        frequency: 7,
        incidentIds: [],
        timeRangeStart: "20:00",
        timeRangeEnd: "23:00"
      },
      {
        id: "316735dd-8f0c-4c49-a7e6-d89edb9bcd37",
        title: "Inconsistent Train Frequency",
        description: "Customers complain about long intervals between trains during off-peak hours.",
        priority: 3,
        frequency: 19,
        incidentIds: [],
        timeRangeStart: "11:00",
        timeRangeEnd: "15:00"
      },
      {
        id: "4c293fdc-330a-4e93-bbdf-42a7b07d7a16",
        title: "Escalator Outages",
        description: "Recurring reports of escalators being out of service, especially in high-traffic stations.",
        priority: 2,
        frequency: 21,
        incidentIds: [],
        timeRangeStart: "10:00",
        timeRangeEnd: "18:00"
      },
      {
        id: "3deba53a-74bc-4c97-8e30-67a63aafae6f",
        title: "Delayed Incident Notifications",
        description: "Passengers mention that push notifications about disruptions often arrive too late.",
        priority: 1,
        frequency: 12,
        incidentIds: [],
        timeRangeStart: "06:00",
        timeRangeEnd: "19:00"
      },
      {
        id: "ac4b73e8-4426-4e52-b6e3-65ed49bb9c3c",
        title: "Insufficient Cleanliness",
        description: "Feedback repeatedly highlights dirty seats, floors, and overflowing bins on late-night trains.",
        priority: 4,
        frequency: 26,
        incidentIds: [],
        timeRangeStart: "20:00",
        timeRangeEnd: "23:59"
      },
      {
        id: "d6e69f33-ef8e-4dae-9ecc-c0a34936c7fb",
        title: "Disrupted Last-Mile Connections",
        description: "Passengers report missed bus connections due to delays on final evening train runs.",
        priority: 3,
        frequency: 8,
        incidentIds: [],
        timeRangeStart: "21:00",
        timeRangeEnd: "23:00"
      },
      {
        id: "e8ffb216-1e13-4f78-9783-d78f73074663",
        title: "Low Mobile Signal on Platforms",
        description: "Users frequently mention weak cell service in deep underground platforms.",
        priority: 5,
        frequency: 15,
        incidentIds: [],
        timeRangeStart: "06:00",
        timeRangeEnd: "22:00"
      },
      {
        id: "b7256dcc-aa48-4f6b-b003-a4d292ef90a6",
        title: "Confusing Line Diversions",
        description: "Customers struggle with understanding temporary reroutes or maintenance-day changes.",
        priority: 2,
        frequency: 17,
        incidentIds: [],
        timeRangeStart: "09:00",
        timeRangeEnd: "17:00"
      },
      {
        id: "0c5801e1-10cf-47a4-b779-254b3db1fdc3",
        title: "Long Wait Times for Assistance",
        description: "Passengers note slow response times when requesting help from station staff.",
        priority: 1,
        frequency: 6,
        incidentIds: [],
        timeRangeStart: "08:00",
        timeRangeEnd: "20:00"
      }
    ];

    return NextResponse.json({
      success: true,
      patterns: mockPatterns,
      metadata: {
        totalIncidents: 0,
        patternsFound: mockPatterns.length,
        processingTime: 0,
        usedCache: true,
        mocked: true
      }
    });

    /* DISABLED CLUSTERING CODE
    const supabase = await createClient();
    
    // Parse request body
    const body = await request.json();
    const { incident_ids, options, preview, filters, dateRange } = body as {
      incident_ids?: string[];
      options?: ClusteringOptions;
      preview?: boolean;
      filters?: Record<string, string[]>;
      dateRange?: string;
    };
    
    console.log('=== CLUSTERING REQUEST ===');
    console.log('Incident IDs count:', incident_ids?.length || 'all');
    console.log('Filters:', filters);
    console.log('Date Range:', dateRange);
    console.log('Options received:', options ? JSON.stringify(options, null, 2) : 'undefined (will use defaults)');
    console.log('Preview mode:', preview);
    */
    
    /* DISABLED - ALL CLUSTERING CODE
    // Fetch incidents from database with filters
    let query = supabase.from('incidents').select('*');
    
    // Apply incident_ids filter if provided
    if (incident_ids && incident_ids.length > 0) {
      query = query.in('id', incident_ids);
    }
    
    // Apply date range filter
    if (dateRange) {
      const now = new Date();
      let startDate: Date;
      
      switch (dateRange) {
        case 'Last 24 hours':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case 'Last 7 days':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 30 days':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case 'Last 90 days':
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }
      
      query = query.gte('time', startDate.toISOString());
    }
    
    // Apply field filters (service, source, category, subservice, priority)
    if (filters) {
      Object.entries(filters).forEach(([field, values]) => {
        if (values && values.length > 0) {
          // Handle priority field - remove 'P' prefix
          if (field === 'priority') {
            const priorityValues = values.map(v => parseInt(v.replace('P', '')));
            query = query.in(field, priorityValues);
          } else {
            query = query.in(field, values);
          }
        }
      });
    }
    
    const { data: incidents, error: fetchError } = await query;
    
    console.log('Fetched incidents:', incidents?.length || 0);
    
    if (fetchError) {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch incidents', details: fetchError.message },
        { status: 500 }
      );
    }
    
    if (!incidents || incidents.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No incidents found' },
        { status: 404 }
      );
    }
    
    // Map database fields to clustering Incident type
    const mappedIncidents: Incident[] = incidents.map((inc: any) => ({
      id: inc.id,
      time: inc.time,
      service: inc.service || '',
      source: inc.source || '',
      subservice: inc.subservice || '',
      priority: inc.priority || 0,
      category: inc.category || '',
      sentimentAnalysis: inc.sentiment_analysis || inc.sentimentAnalysis || '',
      summary: inc.summary || '',
      original: inc.original || '',
      keywords: inc.keywords || [],
    }));
    
    console.log('Mapped incidents sample (first 3):');
    mappedIncidents.slice(0, 3).forEach((inc, idx) => {
      console.log(`  [${idx}]:`, {
        id: inc.id,
        time: inc.time,
        service: inc.service,
        category: inc.category,
        summary: inc.summary?.substring(0, 100),
        keywords: inc.keywords,
      });
    });
    
    // Run clustering algorithm
    const clusteringOptions = options || {
      similarityThreshold: 0.55, // Slightly higher threshold for better quality
      timeWindowHours: 168,      // 7 days window to capture more incidents
      minClusterSize: 2,         // Require at least 2 incidents per pattern
      useEmbeddings: true,       // Enable AI-powered clustering with local model (cached)
      embeddingModel: 'Xenova/all-MiniLM-L6-v2',
    };
    
    // Load cached embeddings and translations from database
    const incidentIds = mappedIncidents.map(inc => inc.id);
    const cachedEmbeddings = await loadCachedEmbeddings(incidentIds, supabase);
    const cachedTranslations = await loadCachedTranslations(incidentIds, supabase);
    
    console.log(`📦 Cache status before clustering:`);
    console.log(`   - Embeddings: ${cachedEmbeddings.size}/${incidentIds.length}`);
    console.log(`   - Translations: ${cachedTranslations.size}/${incidentIds.length}`);
    
    clusteringOptions.cachedEmbeddings = cachedEmbeddings;
    clusteringOptions.cachedTranslations = cachedTranslations;
    
    console.log('Starting clustering with options:', {
      similarityThreshold: clusteringOptions.similarityThreshold,
      timeWindowHours: clusteringOptions.timeWindowHours,
      minClusterSize: clusteringOptions.minClusterSize,
      useEmbeddings: clusteringOptions.useEmbeddings,
      embeddingModel: clusteringOptions.embeddingModel,
      cachedEmbeddingsSize: cachedEmbeddings.size,
      cachedTranslationsSize: cachedTranslations.size
    });
    const patterns = await clusterIncidents(mappedIncidents, clusteringOptions);
    console.log('Clustering complete. Patterns generated:', patterns.length);
    
    // Save new embeddings and translations back to database for future use
    // Check if there are any new embeddings to save
    const newEmbeddingsCount = (clusteringOptions.cachedEmbeddings?.size || 0) - cachedEmbeddings.size;
    if (clusteringOptions.cachedEmbeddings && newEmbeddingsCount > 0) {
      console.log(`💾 Saving ${newEmbeddingsCount} new embeddings to database...`);
      await saveCachedEmbeddings(clusteringOptions.cachedEmbeddings, supabase);
    }
    
    // Check if there are any new translations to save
    const newTranslationsCount = (clusteringOptions.cachedTranslations?.size || 0) - cachedTranslations.size;
    if (clusteringOptions.cachedTranslations && newTranslationsCount > 0) {
      console.log(`💾 Saving ${newTranslationsCount} new translations to database...`);
      await saveCachedTranslations(clusteringOptions.cachedTranslations, supabase);
    }
    
    // If preview mode, just return the patterns without saving
    if (preview) {
      return NextResponse.json({
        success: true,
        patterns_created: patterns.length,
        patterns: patterns.map(p => ({
          title: p.title,
          description: p.description,
          filters: p.filters,
          priority: p.priority,
          frequency: p.frequency,
          time_range: {
            start: p.timeRangeStart,
            end: p.timeRangeEnd,
          },
          incident_ids: p.incidentIds,
        })),
      });
    }
    
    // Save patterns to database
    const savedPatterns: any[] = [];
    
    for (const pattern of patterns) {
      const { data: savedPattern, error: saveError } = await supabase
        .from('patterns')
        .insert({
          title: pattern.title,
          description: pattern.description,
          filters: pattern.filters,
          priority: pattern.priority,
          frequency: pattern.frequency,
          timeRangeStart: pattern.timeRangeStart,
          timeRangeEnd: pattern.timeRangeEnd,
          incident_ids: pattern.incidentIds,
        })
        .select()
        .single();
      
      if (saveError) {
        console.error('Error saving pattern:', saveError);
        continue;
      }
      
      savedPatterns.push(savedPattern);
      
      // Create incident-pattern relationships
      if (pattern.incidentIds && savedPattern) {
        const relationships = pattern.incidentIds.map(incidentId => ({
          incident_id: incidentId,
          pattern_id: savedPattern.id,
          similarity_score: 1.0, // Could compute actual similarity if needed
        }));
        
        await supabase.from('incident_patterns').insert(relationships);
      }
    }
    
    return NextResponse.json({
      success: true,
      patterns_created: savedPatterns.length,
      patterns: savedPatterns.map(p => ({
        id: p.id,
        title: p.title,
        priority: p.priority,
        frequency: p.frequency,
        time_range: {
          start: p.timeRangeStart,
          end: p.timeRangeEnd,
        },
      })),
    });
    END OF DISABLED CODE */
    
  } catch (error: any) {
    console.error('Clustering error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
