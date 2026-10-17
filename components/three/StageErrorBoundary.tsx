"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };

// Qualquer erro dentro do canvas troca o 3D pelo poster; o resto da página segue normal.
export default class StageErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.warn("[turinq] 3D desativado:", error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
