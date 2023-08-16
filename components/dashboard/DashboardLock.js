import React from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Locks from '../locks/LockView';
import Link from "next/link";
export default function DashboardLock() {
    return (
        <div>
            <div className='siteWidth'>
                <div className='dashboardBody'>
                    <Tabs>
                        <TabList className='titleHeader flex flex-wrap'>
                            {/* <Tab className='menuList btnLightBlue rounded'>Locks Shared with me</Tab>
                            <Tab className='menuList btnLightBlue rounded'>Explore New Devices</Tab> */}
                        </TabList>

                        <TabPanel>
                            <div className='lockBox flex flex-wrap'>
                                <div className='colW'>
                                    <Locks />
                                </div>
                                <div className='colW'>
                                    <Locks />
                                </div>
                                <div className='colW'>
                                    <Locks />
                                </div>
                                <div className='colW'>
                                    <Locks />
                                </div>
                            </div>
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
