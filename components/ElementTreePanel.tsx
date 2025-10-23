'use client';

import { useEffect, useState } from 'react';
import { SelectedElement } from '@/lib/types';
import { ChevronRight, ChevronDown, Image as ImageIcon, Type, Box, FolderTree } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface TreeElement {
  id: string;
  tagName: string;
  isImage: boolean;
  isText: boolean;
  element: HTMLElement;
  children: TreeElement[];
}

interface ElementTreePanelProps {
  htmlContent: string;
  selectedElement: SelectedElement | null;
  onSelect: (element: SelectedElement) => void;
  stageRef: HTMLDivElement | null;
}

export function ElementTreePanel({ htmlContent, selectedElement, onSelect, stageRef }: ElementTreePanelProps) {
  const [treeData, setTreeData] = useState<TreeElement[]>([]);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!stageRef) return;

    const buildTree = (container: HTMLElement): TreeElement[] => {
      const elements: TreeElement[] = [];

      Array.from(container.children).forEach((child) => {
        const htmlChild = child as HTMLElement;
        if (!htmlChild.id) return;

        const isImage = htmlChild.tagName.toLowerCase() === 'img';
        const isText = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'].includes(htmlChild.tagName.toLowerCase()) && !isImage;

        const treeElement: TreeElement = {
          id: htmlChild.id,
          tagName: htmlChild.tagName,
          isImage,
          isText,
          element: htmlChild,
          children: buildTree(htmlChild),
        };

        elements.push(treeElement);
      });

      return elements;
    };

    const tree = buildTree(stageRef);
    setTreeData(tree);

    const allIds = new Set<string>();
    const collectIds = (elements: TreeElement[]) => {
      elements.forEach((el) => {
        allIds.add(el.id);
        collectIds(el.children);
      });
    };
    collectIds(tree);
    setExpandedNodes(allIds);
  }, [htmlContent, stageRef]);

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleElementClick = (treeElement: TreeElement) => {
    const selection: SelectedElement = {
      id: treeElement.id,
      element: treeElement.element,
      tagName: treeElement.tagName,
      isImage: treeElement.isImage,
      isText: treeElement.isText,
    };
    onSelect(selection);
  };

  const getElementIcon = (treeElement: TreeElement) => {
    if (treeElement.isImage) {
      return <ImageIcon className="w-3 h-3 text-blue-400" />;
    }
    if (treeElement.isText) {
      return <Type className="w-3 h-3 text-green-400" />;
    }
    return <Box className="w-3 h-3 text-slate-500" />;
  };

  const getElementLabel = (treeElement: TreeElement) => {
    const tagName = treeElement.tagName.toLowerCase();
    if (treeElement.isText && treeElement.element.textContent) {
      const preview = treeElement.element.textContent.slice(0, 20);
      return `${tagName} - "${preview}${treeElement.element.textContent.length > 20 ? '...' : ''}"`;
    }
    if (treeElement.isImage) {
      return `${tagName} - image`;
    }
    return tagName;
  };

  const renderTree = (elements: TreeElement[], depth: number = 0) => {
    return elements.map((treeElement) => {
      const isExpanded = expandedNodes.has(treeElement.id);
      const isSelected = selectedElement?.id === treeElement.id;
      const hasChildren = treeElement.children.length > 0;

      return (
        <div key={treeElement.id} style={{ marginLeft: `${depth * 12}px` }}>
          <div
            className={`flex items-center gap-1.5 px-2 py-1 rounded cursor-pointer hover:bg-slate-800/50 transition-colors text-xs ${
              isSelected ? 'bg-blue-600/30 text-blue-300' : 'text-slate-400'
            }`}
            onClick={() => handleElementClick(treeElement)}
          >
            {hasChildren && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNode(treeElement.id);
                }}
                className="hover:bg-slate-700 rounded p-0.5"
              >
                {isExpanded ? (
                  <ChevronDown className="w-2.5 h-2.5" />
                ) : (
                  <ChevronRight className="w-2.5 h-2.5" />
                )}
              </button>
            )}
            {!hasChildren && <div className="w-3.5" />}
            {getElementIcon(treeElement)}
            <span className="truncate flex-1">{getElementLabel(treeElement)}</span>
          </div>
          {hasChildren && isExpanded && renderTree(treeElement.children, depth + 1)}
        </div>
      );
    });
  };

  return (
    <Collapsible>
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:bg-slate-800/50 hover:text-white transition-all duration-200 group"
        >
          <FolderTree className="w-4 h-4 mr-3 group-hover:scale-110 transition-transform" />
          Element Tree
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-2 py-2 max-h-60 overflow-y-auto">
        {treeData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="w-8 h-8 rounded-full bg-slate-800/30 flex items-center justify-center mb-2">
              <FolderTree className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-xs text-slate-400">No elements</p>
          </div>
        ) : (
          <div className="space-y-0.5">{renderTree(treeData)}</div>
        )}
      </CollapsibleContent>
    </Collapsible>
  );
}
