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

    return (
        <div>
            {tabs.map((tab) => (
                <button
                key = {tab.label}
                onClick = {() => setActiveTab(tab)}
                >
                    {tab.label}
                </button>
            ))}
            <div>
                {activeTab.content}
            </div>
        </div>
    )
}

export default Tabs