import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit{
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;
  @ViewChild('progressHandle') progressHandleRef!: ElementRef<HTMLDivElement>;
  
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  isDragging: boolean = false;
  audioSrc: string = './assets/love-into-a-mirage.wav';
  imageLoaded = false;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {}

  ngAfterViewInit() {
    const audioElement = this.audioPlayerRef.nativeElement;
    
    audioElement.addEventListener('loadedmetadata', () => {
      this.ngZone.run(() => {
        this.duration = audioElement.duration;
      });
    });

    audioElement.addEventListener('timeupdate', () => {
      if (!this.isDragging) {
        this.ngZone.run(() => {
          this.currentTime = audioElement.currentTime;
          this.updateProgressHandle();
        });
      }
    });

    this.progressBarRef.nativeElement.addEventListener('mousedown', () => {
      this.isDragging = true;
    });

    document.addEventListener('mouseup', () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.seek();
      }
    });
  }

  togglePlay() {
    const audioElement = this.audioPlayerRef.nativeElement;
    if (this.isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    this.isPlaying = !this.isPlaying;
  }

  seek() {
    const audioElement = this.audioPlayerRef.nativeElement;
    const progressBar = this.progressBarRef.nativeElement;
    const seekTime = Number(progressBar.value);
    audioElement.currentTime = seekTime;
    this.currentTime = seekTime;
    this.updateProgressHandle();
  }

  formatTime(time: number): string {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  updateProgressHandle() {
    const progressBar = this.progressBarRef.nativeElement;
    const progressHandle = this.progressHandleRef.nativeElement;
    const percentage = (this.currentTime / this.duration) * 100;
    progressHandle.style.left = `${percentage}%`;
    progressBar.style.setProperty('--progress-percentage', `${percentage}%`);
  }

  downloadAudio() {
    const link = document.createElement('a');
    link.href = this.audioSrc;
    link.download = 'love-into-a-mirage.wav';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  loadImage() {
    this.imageLoaded = true;
  }
}