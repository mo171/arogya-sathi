/**
 * Audio recording utility using Web Audio API
 */

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  /**
   * Starts audio recording
   * @returns Promise that resolves when recording starts
   */
  async startRecording(): Promise<void> {
    try {
      // Request microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream);
      this.audioChunks = [];

      // Collect audio data
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      throw new Error(
        "Failed to start recording. Please check microphone permissions.",
      );
    }
  }

  /**
   * Stops audio recording and returns the audio blob
   * @returns Promise with the recorded audio blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error("No active recording"));
        return;
      }

      this.mediaRecorder.onstop = () => {
        // Create blob from chunks
        const audioBlob = new Blob(this.audioChunks, { type: "audio/webm" });

        // Stop all tracks
        if (this.stream) {
          this.stream.getTracks().forEach((track) => track.stop());
        }

        // Clean up
        this.mediaRecorder = null;
        this.stream = null;
        this.audioChunks = [];

        resolve(audioBlob);
      };

      this.mediaRecorder.onerror = (error) => {
        reject(error);
      };

      // Stop recording
      this.mediaRecorder.stop();
    });
  }

  /**
   * Checks if recording is currently active
   */
  isRecording(): boolean {
    return this.mediaRecorder?.state === "recording";
  }

  /**
   * Cancels the current recording without returning data
   */
  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }

    this.mediaRecorder = null;
    this.stream = null;
    this.audioChunks = [];
  }
}
