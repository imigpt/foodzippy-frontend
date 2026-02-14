import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Pause, Trash2, Upload, Check } from 'lucide-react';

interface VoiceRecorderProps {
  onUploadComplete: (url: string) => void;
  initialUrl?: string;
}

export default function VoiceRecorder({ onUploadComplete, initialUrl }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string>(initialUrl || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(!!initialUrl);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (audioUrl && !initialUrl && !isUploaded) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl, initialUrl, isUploaded]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        setIsUploaded(false);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 180) {
            // 3 minutes max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please grant permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const uploadToCloudinary = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-note.webm');
      formData.append('upload_preset', 'foodzippy_vendors');
      formData.append('resource_type', 'video'); // Cloudinary requires 'video' for audio

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      if (!cloudName) {
        throw new Error('Cloudinary configuration missing');
      }

      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Upload failed');
      }

      const result = await response.json();
      onUploadComplete(result.secure_url);
      setIsUploaded(true);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(error.message || 'Failed to upload voice note. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteRecording = () => {
    if (audioUrl && !initialUrl && !isUploaded) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl('');
    setIsPlaying(false);
    setRecordingTime(0);
    setIsUploaded(false);
    onUploadComplete('');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap">
        {!isRecording && !audioUrl && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            <Mic className="w-5 h-5" />
            Start Recording
          </button>
        )}

        {isRecording && (
          <>
            <button
              type="button"
              onClick={stopRecording}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
            >
              <Square className="w-5 h-5" />
              Stop Recording
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-mono font-bold text-red-600">{formatTime(recordingTime)}</span>
            </div>
          </>
        )}

        {audioUrl && !isRecording && (
          <>
            <audio
              ref={audioRef}
              src={audioUrl}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <button
              type="button"
              onClick={togglePlayback}
              className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Play
                </>
              )}
            </button>

            {recordingTime > 0 && (
              <span className="text-sm text-gray-600 px-3 py-2 bg-gray-100 rounded-lg font-mono">
                {formatTime(recordingTime)}
              </span>
            )}

            {!isUploaded && (
              <button
                type="button"
                onClick={uploadToCloudinary}
                disabled={isUploading}
                className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <Upload className="w-5 h-5 animate-bounce" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Voice Note
                  </>
                )}
              </button>
            )}

            {isUploaded && (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">Uploaded successfully</span>
              </div>
            )}

            <button
              type="button"
              onClick={deleteRecording}
              className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Trash2 className="w-5 h-5" />
              Delete
            </button>
          </>
        )}
      </div>

      {isRecording && (
        <p className="text-sm text-gray-600">
          Maximum recording time: 3 minutes
        </p>
      )}

      {audioUrl && !isUploaded && !isRecording && (
        <p className="text-sm text-amber-600 font-medium">
          ⚠️ Please upload your voice note before submitting the form
        </p>
      )}
    </div>
  );
}
