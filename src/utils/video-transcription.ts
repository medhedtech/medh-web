import { Transcription } from '../components/shared/lessons/types';

export class TranscriptionManager {
  private static instance: TranscriptionManager;
  private transcriptions: Map<string, Transcription> = new Map();
  private currentLanguage: string = 'en';
  private onTranscriptUpdate?: (segment: { text: string; start: number; end: number }) => void;

  private constructor() {}

  static getInstance(): TranscriptionManager {
    if (!TranscriptionManager.instance) {
      TranscriptionManager.instance = new TranscriptionManager();
    }
    return TranscriptionManager.instance;
  }

  async loadTranscription(language: string, url: string): Promise<void> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to load transcription');
      
      const transcription: Transcription = await response.json();
      this.transcriptions.set(language, transcription);
      
      if (!this.currentLanguage) {
        this.currentLanguage = language;
      }
    } catch (error) {
      console.error('Error loading transcription:', error);
      throw error;
    }
  }

  setLanguage(language: string): void {
    if (this.transcriptions.has(language)) {
      this.currentLanguage = language;
    } else {
      throw new Error(`Transcription for language ${language} not loaded`);
    }
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getAvailableLanguages(): string[] {
    return Array.from(this.transcriptions.keys());
  }

  findSegmentAtTime(time: number): { text: string; start: number; end: number } | null {
    const transcription = this.transcriptions.get(this.currentLanguage);
    if (!transcription) return null;

    const segment = transcription.segments.find(
      seg => time >= seg.start && time <= seg.end
    );

    return segment ? {
      text: segment.text,
      start: segment.start,
      end: segment.end
    } : null;
  }

  setTranscriptUpdateCallback(
    callback: (segment: { text: string; start: number; end: number }) => void
  ): void {
    this.onTranscriptUpdate = callback;
  }

  updateCurrentSegment(time: number): void {
    const segment = this.findSegmentAtTime(time);
    if (segment && this.onTranscriptUpdate) {
      this.onTranscriptUpdate(segment);
    }
  }

  searchTranscript(query: string): {
    text: string;
    start: number;
    end: number;
    confidence?: number;
  }[] {
    const transcription = this.transcriptions.get(this.currentLanguage);
    if (!transcription) return [];

    const results = transcription.segments.filter(segment =>
      segment.text.toLowerCase().includes(query.toLowerCase())
    );

    return results.map(segment => ({
      text: segment.text,
      start: segment.start,
      end: segment.end
    }));
  }

  getTranscriptInRange(start: number, end: number): string {
    const transcription = this.transcriptions.get(this.currentLanguage);
    if (!transcription) return '';

    const segments = transcription.segments.filter(
      segment => segment.start >= start && segment.end <= end
    );

    return segments.map(segment => segment.text).join(' ');
  }

  exportTranscript(format: 'txt' | 'srt' | 'vtt'): string {
    const transcription = this.transcriptions.get(this.currentLanguage);
    if (!transcription) return '';

    switch (format) {
      case 'txt':
        return transcription.segments
          .map(segment => segment.text)
          .join('\n\n');

      case 'srt':
        return transcription.segments
          .map((segment, index) => {
            const startTime = this.formatTimestamp(segment.start);
            const endTime = this.formatTimestamp(segment.end);
            return `${index + 1}\n${startTime} --> ${endTime}\n${segment.text}\n`;
          })
          .join('\n');

      case 'vtt':
        return `WEBVTT\n\n${transcription.segments
          .map((segment, index) => {
            const startTime = this.formatTimestamp(segment.start);
            const endTime = this.formatTimestamp(segment.end);
            return `${startTime} --> ${endTime}\n${segment.text}\n`;
          })
          .join('\n')}`;

      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  private formatTimestamp(seconds: number): string {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours().toString().padStart(2, '0');
    const mm = date.getUTCMinutes().toString().padStart(2, '0');
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    const ms = date.getUTCMilliseconds().toString().padStart(3, '0');
    return `${hh}:${mm}:${ss},${ms}`;
  }
} 