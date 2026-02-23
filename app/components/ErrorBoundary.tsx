"use client";

import { Component, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface Props {
    children: ReactNode;
    fallbackMessage?: string;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex-1 flex items-center justify-center bg-black text-white p-8">
                    <div className="text-center space-y-6 max-w-md">
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto">
                            <AlertTriangle className="w-8 h-8 text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Something went wrong</h2>
                            <p className="text-gray-400 text-sm">
                                {this.props.fallbackMessage ||
                                    "An unexpected error occurred. Please try refreshing the page."}
                            </p>
                            {this.state.error && (
                                <p className="text-xs text-gray-600 font-mono mt-4 bg-white/5 rounded-lg p-3 text-left break-all">
                                    {this.state.error.message}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => {
                                this.setState({ hasError: false, error: null });
                                window.location.reload();
                            }}
                            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                        >
                            <RotateCcw className="w-4 h-4" /> Reload Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
