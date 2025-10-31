import { Component } from '@angular/core';
import { transition, trigger, useAnimation } from '@angular/animations';
import { shakeX, pulse, jello } from 'ng-animate';

// Même durée que l'animation de FadeIn
const SPAWN_DURATION_MS = 500;

const DEATH_DURATION_SECONDS = 0.5;
const PREATTACK_JELLO_DURATION_SECONDS = 0.5;
const ATTACK_PULSE_DURATION_SECONDS = 0.3;
const HIT_WOBBLE_DURATION_SECONDS = 0.3;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('death', [
      transition(':increment', useAnimation(shakeX, { params: { timing: DEATH_DURATION_SECONDS } }))
    ]),
    trigger('attack', [
      transition(':increment', useAnimation(pulse, { params: { timing: ATTACK_PULSE_DURATION_SECONDS, scale: 4.5 } }))
    ]),
    trigger('preAttack', [
      transition(':increment', useAnimation(jello, { params: { timing: PREATTACK_JELLO_DURATION_SECONDS } }))
    ])
  ]
})
export class AppComponent {
  slimeIsPresent = false;
  cantInteractWithSlime = false;

  ng_death = 0;
  ng_attack = 0;
  ng_preAttack = 0;

  css_hit = false;

  constructor() {
  }

  showSlime(){
    var element = document.getElementById("slimeyId");
    element?.classList.remove("fadeOut");
    element?.classList.add("fadeIn");
  }

  hideSlime(){
    var element = document.getElementById("slimeyId");
    element?.classList.remove("fadeIn");
    element?.classList.add("fadeOut");
  }

  spawn() {
    this.slimeIsPresent = true;
    // TODO Animation angular avec forwards
    // Utiliser showSlime pour afficher Slimey
    this.showSlime();
    // If you want to prevent interactions briefly while spawn animates:
    this.cantInteractWithSlime = true;
    setTimeout(() => { this.cantInteractWithSlime = false; }, SPAWN_DURATION_MS);
  }

  death(){
    this.slimeIsPresent = false;
    // TODO Animation angular avec forwards

    // TODO 2e animation angular en même temps
    // Start CSS fade out
    this.hideSlime();

    // trigger angular shake animation by incrementing ng_death
    this.cantInteractWithSlime = true;
    this.ng_death++;

    // re-enable interactions after the animation finishes
    setTimeout(() => {
      this.cantInteractWithSlime = false;
    }, DEATH_DURATION_SECONDS * 1000);
  }

  attack(){
    // TODO Jouer une animation et augmenter l'intensité du mouvement avec scale
    // TODO Jouer une autre animation avant
    // play pre-attack jello, then after a short delay play the attack pulse (scale)
    this.cantInteractWithSlime = true;

    this.ng_preAttack++; // triggers preAttack (jello)

    // small delay so preAttack begins then attack pulse happens (200ms chosen to overlap nicely)
    setTimeout(() => {
      this.ng_attack++; // triggers attack (pulse) with scale
    }, 200);

    // unlock interaction after both animations are likely finished
    const totalMs = Math.max(PREATTACK_JELLO_DURATION_SECONDS, ATTACK_PULSE_DURATION_SECONDS) * 1000 + 100;
    setTimeout(() => {
      this.cantInteractWithSlime = false;
    }, totalMs);
  }

  hit(){
    // TODO Utilisé Animista pour faire une animation différente avec css (wobble)
    // add the css class to trigger the Animista wobble and remove it after duration so it can replay
    this.css_hit = true;
    setTimeout(() => this.css_hit = false, HIT_WOBBLE_DURATION_SECONDS * 1000);
  }
}
