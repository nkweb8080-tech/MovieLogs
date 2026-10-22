'use client'
import { useState } from 'react'

//型定義
type TabPage = {
    label: string;
    content: React.ReactNode
}

type TabProps = {
    tabs: TabPage[]
}

//タブ機能
const Tabs = ({ tabs }: TabProps) => {
    // Fix: タブ要素そのものを state に保持すると再描画後も古い content が残るため、インデックスを保持
    const [activeIndex, setActiveIndex] = useState(0)
    const activeTab = tabs[activeIndex] ?? tabs[0]

    return (
        <div>
            <div
                role="tablist"
                aria-label="表示切り替え"
                className="inline-flex gap-1 rounded-2xl border border-line bg-surface-2 p-1"
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab?.label === tab.label

                    return (
                        <button
                            key = {tab.label}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick = {() => setActiveIndex(index)}
                            className={`btn btn-sm rounded-xl ${
                                isActive
                                    ? 'bg-surface text-foreground shadow-sm'
                                    : 'bg-transparent text-muted hover:text-foreground'
                            }`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>
            <div className="mt-6">
                {activeTab?.content}
            </div>
        </div>
    )
}

export default Tabs
