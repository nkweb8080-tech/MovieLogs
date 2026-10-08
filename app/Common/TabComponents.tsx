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
    const [activeTab, setActiveTab] = useState(tabs[0])

    /* ------------------------------------------------------------------
       [編集] 見た目のみ変更（タブ切り替えのロジックは従来どおり）
       - 素のボタンの並びだった部分を、選択中が分かるピル型タブバーに変更
       - タブ内容はカード面（.card）の上に表示して白基調の階層を作る
       ------------------------------------------------------------------ */
    return (
        <div>
            <div
                role="tablist"
                aria-label="表示切り替え"
                className="inline-flex gap-1 rounded-2xl border border-line bg-surface-2 p-1"
            >
                {tabs.map((tab) => {
                    const isActive = activeTab.label === tab.label

                    return (
                        <button
                            key = {tab.label}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            onClick = {() => setActiveTab(tab)}
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
                {activeTab.content}
            </div>
        </div>
    )
}

export default Tabs
