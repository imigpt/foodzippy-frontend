import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Play, Trash2, Upload } from 'lucide-react';

export interface ReviewData {
  followUpDate: string;
  convincingStatus: 'convenience' | 'convertible' | 'not_convertible' | '';
  behavior: 'excellent' | 'good' | 'rude' | '';
  audioUrl: string;
}

interface VendorReviewSectionProps {
  data: ReviewData;
  onUpdate: (data: Partial<ReviewData>) => void;
  errors?: { [key: string]: string };
}

function VendorReviewSection({ data, onUpdate, errors = {} }: VendorReviewSectionProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioPreviewUrl) URL.revokeObjectURL(audioPreviewUrl);
    };
  }, [audioPreviewUrl]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioPreviewUrl(url);
        
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= 180) { // 3 minutes max
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    if (audioPreviewUrl) {
      URL.revokeObjectURL(audioPreviewUrl);
    }
    setAudioPreviewUrl(null);
    setRecordingTime(0);
    onUpdate({ audioUrl: '' });
  };

  const uploadToCloudinary = async () => {
    if (!audioBlob) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'voice-note.webm');
      formData.append('upload_preset', 'foodzippy_vendors'); // You need to create this in Cloudinary
      formData.append('resource_type', 'video'); // Cloudinary requires 'video' for audio files

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your-cloud-name';
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      onUpdate({ audioUrl: result.secure_url });
      alert('Voice note uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload voice note. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border-2 border-blue-200">
      <div className="border-b-2 border-blue-300 pb-3">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm">STEP 2</span>
          Review & Follow-up Details
        </h2>
        <p className="text-slate-600 mt-2">Complete this section before submitting</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Follow-up Date */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Next Follow-Up Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            min={getTomorrowDate()}
            value={data.followUpDate}
            onChange={(e) => onUpdate({ followUpDate: e.target.value })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.followUpDate ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.followUpDate && (
            <p className="text-red-500 text-sm mt-1">{errors.followUpDate}</p>
          )}
        </div>

        {/* Convincing Status */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Convincing Status <span className="text-red-500">*</span>
          </label>
          <select
            value={data.convincingStatus}
            onChange={(e) => onUpdate({ convincingStatus: e.target.value as any })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.convincingStatus ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select Status</option>
            <option value="convenience">Convenience</option>
            <option value="convertible">Convertible</option>
            <option value="not_convertible">Not Convertible</option>
          </select>
          {errors.convincingStatus && (
            <p className="text-red-500 text-sm mt-1">{errors.convincingStatus}</p>
          )}
        </div>

        {/* Behavior */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Way of Behavior <span className="text-red-500">*</span>
          </label>
          <select
            value={data.behavior}
            onChange={(e) => onUpdate({ behavior: e.target.value as any })}
            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.behavior ? 'border-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select Behavior</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="rude">Rude</option>
          </select>
          {errors.behavior && (
            <p className="text-red-500 text-sm mt-1">{errors.behavior}</p>
          )}
        </div>

        {/* Voice Recording */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Voice Note (Optional)
          </label>
          
          {!audioPreviewUrl && !isRecording && (
            <button
              type="button"
              onClick={startRecording}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              <Mic size={20} />
              Start Recording
            </button>
          )}

          {isRecording && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-red-100 px-4 py-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="font-mono font-bold text-red-700">{formatTime(recordingTime)}</span>
                </div>
                <span className="text-sm text-red-600">Recording...</span>
              </div>
              <button
                type="button"
                onClick={stopRecording}
                className="px-4 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <Square size={20} />
              </button>
            </div>
          )}

          {audioPreviewUrl && (
            <div className="space-y-3">
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">
                    Recording Ready ({formatTime(recordingTime)})
                  </span>
                  <button
                    type="button"
                    onClick={deleteRecording}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <audio controls src={audioPreviewUrl} className="w-full h-8" />
              </div>
              
              {!data.audioUrl && (
                <button
                  type="button"
                  onClick={uploadToCloudinary}
                  disabled={isUploading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload size={18} />
                      Upload Voice Note
                    </>
                  )}
                </button>
              )}
              
              {data.audioUrl && (
                <div className="text-center text-sm text-green-600 font-medium">
                  ✓ Voice note uploaded successfully
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default VendorReviewSection;
