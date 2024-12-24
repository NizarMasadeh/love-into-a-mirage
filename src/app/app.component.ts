import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { inject } from '@vercel/analytics';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy{
  @ViewChild('audioPlayer') audioPlayerRef!: ElementRef<HTMLAudioElement>;
  @ViewChild('progressBar') progressBarRef!: ElementRef<HTMLInputElement>;
  @ViewChild('progressHandle') progressHandleRef!: ElementRef<HTMLDivElement>;
  
  isPlaying: boolean = false;
  currentTime: number = 0;
  duration: number = 0;
  isDragging: boolean = false;
  audioSrc: string = './assets/love-into-a-mirage.wav';
  isLoading = true;

  private documentClickListener: (() => void) | null = null;
  private documentTouchEndListener: (() => void) | null = null;

  constructor(private ngZone: NgZone) {}

  ngOnInit() {
    inject();
  }

  ngAfterViewInit() {
    const audioElement = this.audioPlayerRef.nativeElement;
    const progressBar = this.progressBarRef.nativeElement;
    
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

    progressBar.addEventListener('mousedown', (e) => this.startDragging(e));
    progressBar.addEventListener('touchstart', (e) => this.startDragging(e), { passive: false });

    this.documentClickListener = () => this.stopDragging();
    this.documentTouchEndListener = () => this.stopDragging();

    document.addEventListener('mouseup', this.documentClickListener);
    document.addEventListener('touchend', this.documentTouchEndListener);
  }

  ngOnDestroy() {
    if (this.documentClickListener) {
      document.removeEventListener('mouseup', this.documentClickListener);
    }
    if (this.documentTouchEndListener) {
      document.removeEventListener('touchend', this.documentTouchEndListener);
    }
  }

  startDragging(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.seek(event);
    event.preventDefault();
  }

  stopDragging() {
    if (this.isDragging) {
      this.isDragging = false;
      this.audioPlayerRef.nativeElement.play();
    }
  }

  seek(event: MouseEvent | TouchEvent) {
    const progressBar = this.progressBarRef.nativeElement;
    const rect = progressBar.getBoundingClientRect();
    const clientX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    const seekPercentage = (clientX - rect.left) / rect.width;
    const seekTime = seekPercentage * this.duration;

    this.audioPlayerRef.nativeElement.currentTime = seekTime;
    this.currentTime = seekTime;
    this.updateProgressHandle();
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

  imgLoaded() {
    this.isLoading = false;
  }

  onInstagram() {
    window.open('https://www.instagram.com/nizar_masadeh', '_blank');
  }

  onGithub() {
    window.open('https://github.com/NizarMasadeh', '_blank');
  }
}