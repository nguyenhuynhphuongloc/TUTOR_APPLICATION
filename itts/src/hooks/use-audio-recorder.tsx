import { useRef, useState } from "react";

/**
 * Hook to record audio from the user's microphone.
 *
 * @returns An object with the following properties:
 * - `isRecording`: A boolean indicating whether recording is currently in progress.
 * - `audioURL`: A string containing the URL of the recorded audio (null if no recording has been made).
 * - `startRecording`: A function to start recording audio.
 * - `stopRecording`: A function to stop recording audio.
 * - `toggleRecording`: A function to toggle recording on or off.
 * - `resetRecording`: A function to reset the recorded audio (deleting it).
 */
export function useAudioRecorder(): {
  isRecording: boolean;
  audioURL: string | null;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  toggleRecording: () => void;
  resetRecording: () => void;
  blobFile: Blob | null;
} {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null,
  );
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [blobFile, setBlobFile] = useState<Blob | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startRecording = async (): Promise<void> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        setBlobFile(audioBlob);
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
      };

      recorder.start();
      setIsRecording(true);
      setMediaRecorder(recorder);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = (): void => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      streamRef.current?.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  const toggleRecording = (): void => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const resetRecording = (): void => {
    setAudioURL(null);
  };

  return {
    isRecording,
    audioURL,
    startRecording,
    stopRecording,
    toggleRecording,
    resetRecording,
    blobFile,
  };
}
