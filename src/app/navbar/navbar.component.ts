import {Component, OnInit} from '@angular/core';
import {Contract} from '../model/domain/contract.model';
import {Router} from '@angular/router';
import {Session} from '../model/domain/session';
import {SessionService} from '../services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(
    private router: Router,
    public sessionService: SessionService) {
  }

  ngOnInit(): void {
  }

  openErstellenComponent(): void {
    const session: Session = this.sessionService.getSession();
    session.currentContract = new Contract();
    this.sessionService.setSession(session);
    this.router.navigate(['erstellen']);
  }

  openListeComponent(): void {
    this.router.navigate(['liste']);

  }

  openHochladenComponent(): void {
    this.router.navigate(['hochladen']);
  }
}
