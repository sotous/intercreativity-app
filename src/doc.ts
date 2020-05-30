import { LitElement, html, css, property } from 'lit-element';
import { moduleConnect } from '@uprtcl/micro-orchestrator';
import { EveesModule, EveesRemote } from '@uprtcl/evees';
import { HttpEthAuthProvider } from '@uprtcl/http-provider';

import { Router } from '@vaadin/router';

export class Doc extends moduleConnect(LitElement) {
  @property({ attribute: false })
  docId!: string;
  //
  @property({ attribute: false })
  defaultAuthority!: string;

  @property({ attribute: false })
  perspectiveId: string;

  @property({ attribute: false })
  pageId: string;

  async firstUpdated() {
    const pathElements = window.location.pathname.split('/');

    this.docId = pathElements[2];
    this.perspectiveId =
      pathElements[3] !== 'official' ? pathElements[3] : undefined;
    this.pageId = pathElements.length > 3 ? pathElements[4] : undefined;

    const eveesHttpProvider = this.requestAll(
      EveesModule.bindings.EveesRemote
    ).find((provider: EveesRemote) =>
      provider.authority.startsWith('http')
    ) as HttpEthAuthProvider;

    await eveesHttpProvider.connect();
    this.defaultAuthority = eveesHttpProvider.authority;
  }

  goHome() {
    Router.go(`/home`);
  }

  render() {
    if (this.docId === undefined) return '';
    return html`
      <wiki-drawer
        @back=${() => this.goHome()}
        ref=${this.docId}
        init-ref=${this.perspectiveId}
        page-id=${this.pageId}
        default-authority=${this.defaultAuthority}
        .editableAuthorities=${[this.defaultAuthority]}
      ></wiki-drawer>
    `;
  }

  static styles = css`
    :host {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }

    wiki-drawer {
      flex-grow: 1;
    }
  `;
}
