import { Component } from '@angular/core';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private profileService: ProfileService){}

  // ngOnInit() {
  //   const id = +this.route.snapshot.paramMap.get('id')!;
  //   this.profileService.getProfile(id).subscribe((profile) => {
  //     this.user = profile;
  //   });
  // }
}
