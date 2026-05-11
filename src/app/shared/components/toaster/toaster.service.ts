import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ToasterService {
  private messagesSubject = new BehaviorSubject<ToastMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  private nextId = 1;

  show(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    const toast: ToastMessage = {
      id: this.nextId++,
      message,
      type
    };

    const currentMessages = this.messagesSubject.value;
    this.messagesSubject.next([...currentMessages, toast]);

    setTimeout(() => {
      this.dismiss(toast.id);
    }, 4500);
  }

  dismiss(id: number): void {
    const filtered = this.messagesSubject.value.filter((toast) => toast.id !== id);
    this.messagesSubject.next(filtered);
  }
}
