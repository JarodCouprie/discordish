import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'app-rule',
  standalone: true,
  imports: [
    MatIcon
  ],
  templateUrl: './rule.component.html',
  styleUrl: './rule.component.scss'
})
export class RuleComponent implements OnInit, OnChanges {
  @Input() text: string = "";
  @Input() regexString?: string;
  valid: boolean = false;
  regExp?: RegExp;

  ngOnInit(): void {
    if (this.regexString) {
      this.regExp = new RegExp(this.regexString);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['text'] && this.regExp) {
      this.valid = this.regExp?.test(
        changes['text'].currentValue
      )
    }
  }

}
