'use client'

import React, { useState, useEffect, useRef } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

function DynamicItem({ label, onRemove }) {
    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-move h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{label}</span>
                <button 
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent event bubbling
                        onRemove();
                    }} 
                    className="text-red-500 hover:text-red-700"
                >
                    ×
                </button>
            </div>
            <div className="text-sm text-gray-500 mt-auto">Drag to move • Resize from corner</div>
        </div>
    );
}

function SwapyComponent() {
    const [zones, setZones] = useState([
        { id: 'zone-a', label: 'Zone A', w: 1, h: 1, x: 0, y: 0 },
        { id: 'zone-b', label: 'Zone B', w: 1, h: 1, x: 1, y: 0 }
    ]);
    
    const [newZoneLabel, setNewZoneLabel] = useState('');
    const [zoneType, setZoneType] = useState('regular');
    const [layouts, setLayouts] = useState({});
    
    // Add a ref to track if the layout change is from a user action or programmatic update
    const isUserAction = useRef(true);
    const prevZonesRef = useRef(zones);

    // Update layouts when zones change, but only if it's not from a layout change
    useEffect(() => {
        // Skip the first render or when the update is from a layout change
        if (prevZonesRef.current === zones) {
            return;
        }
        
        // Only update layouts if the change wasn't triggered by onLayoutChange
        if (isUserAction.current) {
            const newLayouts = {
                lg: zones.map(zone => ({
                    i: zone.id,
                    x: zone.x || 0,
                    y: zone.y || 0,
                    w: zone.w || 1,
                    h: zone.h || 1
                }))
            };
            setLayouts(newLayouts);
        }
        
        // Update the previous zones reference
        prevZonesRef.current = zones;
    }, [zones]);

    const handleAddZone = (e) => {
        e.preventDefault();
        if (!newZoneLabel.trim()) return;
        
        // Find a suitable position for the new zone
        const maxY = zones.length > 0 
            ? Math.max(...zones.map(zone => zone.y + zone.h))
            : 0;
        
        const newId = `zone-${Date.now()}`;
        const newZone = { 
            id: newId, 
            label: newZoneLabel,
            type: zoneType,
            w: 1, 
            h: 1,
            // Place new zones at the bottom of the layout
            x: 0,
            y: maxY
        };
        
        // Set flag to indicate this is a user action
        isUserAction.current = true;
        setZones(prev => [...prev, newZone]);
        setNewZoneLabel('');
    };

    const handleRemoveZone = (id) => {
        // Set flag to indicate this is a user action
        isUserAction.current = true;
        setZones(prev => prev.filter(zone => zone.id !== id));
    };

    const onLayoutChange = (currentLayout, allLayouts) => {
        // Only update zone positions if we have a valid layout
        if (currentLayout && currentLayout.length > 0) {
            // Set flag to indicate this is from a layout change
            isUserAction.current = false;
            
            setZones(prev => {
                // Only update if there's an actual change to avoid loops
                const hasChanges = prev.some(zone => {
                    const layoutItem = currentLayout.find(item => item.i === zone.id);
                    if (!layoutItem) return false;
                    
                    return (
                        zone.x !== layoutItem.x ||
                        zone.y !== layoutItem.y ||
                        zone.w !== layoutItem.w ||
                        zone.h !== layoutItem.h
                    );
                });
                
                if (!hasChanges) return prev;
                
                return prev.map(zone => {
                    const layoutItem = currentLayout.find(item => item.i === zone.id);
                    if (layoutItem) {
                        return {
                            ...zone,
                            x: layoutItem.x,
                            y: layoutItem.y,
                            w: layoutItem.w,
                            h: layoutItem.h
                        };
                    }
                    return zone;
                });
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Add New Zone</h3>
                <form onSubmit={handleAddZone} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label htmlFor="zoneLabel" className="block text-sm font-medium text-gray-700">
                                Zone Name
                            </label>
                            <input
                                type="text"
                                id="zoneLabel"
                                value={newZoneLabel}
                                onChange={(e) => setNewZoneLabel(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                placeholder="Enter zone name (e.g., VIP, Entrance, Exit)"
                            />
                        </div>
                        <div>
                            <label htmlFor="zoneType" className="block text-sm font-medium text-gray-700">
                                Zone Type
                            </label>
                            <select
                                id="zoneType"
                                value={zoneType}
                                onChange={e => setZoneType(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="regular">Regular Zone</option>
                                <option value="entrance">Entrance</option>
                                <option value="exit">Exit</option>
                                <option value="vip">VIP</option>
                            </select>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                        Add Zone
                    </button>
                </form>
            </div>

            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">Layout Designer</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Drag zones to rearrange. Resize from the bottom-right corner.
                </p>
                
                {zones.length > 0 ? (
                    <ResponsiveGridLayout
                        className="layout"
                        layouts={layouts}
                        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                        cols={{ lg: 3, md: 3, sm: 2, xs: 1, xxs: 1 }}
                        rowHeight={100}
                        onLayoutChange={(layout, allLayouts) => onLayoutChange(layout, allLayouts)}
                        isResizable={true}
                        isDraggable={true}
                        containerPadding={[15, 15]}
                        compactType="vertical"
                    >
                        {zones.map(zone => (
                            <div key={zone.id} className="border-2 border-gray-300 rounded-lg overflow-hidden">
                                <DynamicItem 
                                    label={zone.label} 
                                    onRemove={() => handleRemoveZone(zone.id)} 
                                />
                            </div>
                        ))}
                    </ResponsiveGridLayout>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No zones added yet. Add a zone to start designing your layout.
                    </div>
                )}
            </div>
        </div>
    );
}

export default SwapyComponent;