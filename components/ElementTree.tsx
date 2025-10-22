'use client';

import { useEffect, useState } from 'react';
import { ChevronRight, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SelectedElement } from '@/lib/types';

interface TreeNode {
  id: string;
  tagName: string;
  element: HTMLElement;
  children: TreeNode[];
  visible: boolean;
}

interface ElementTreeProps {
  stageRef: React.MutableRefObject<HTMLDivElement | null>;
  selectedElement: SelectedElement | null;
  selectedElements: SelectedElement[];
  onSelect: (element: SelectedElement) => void;
  onMultiSelect: (elements: SelectedElement[]) => void;
}

export function ElementTree({ stageRef, selectedElement, selectedElements, onSelect, onMultiSelect }: ElementTreeProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!stageRef.current) return;

    const buildTree = (element: HTMLElement): TreeNode => {
      const children: TreeNode[] = [];
      Array.from(element.children).forEach(child => {
        if (child instanceof HTMLElement && child.id) {
          children.push(buildTree(child));
        }
      });

      return {
        id: element.id,
        tagName: element.tagName.toLowerCase(),
        element,
        children,
        visible: element.style.display !== 'none',
      };
    };

    const roots: TreeNode[] = [];
    Array.from(stageRef.current.children).forEach(child => {
      if (child instanceof HTMLElement && child.id) {
        roots.push(buildTree(child));
      }
    });

    setTree(roots);
  }, [stageRef.current?.innerHTML]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleVisibility = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDisplay = node.visible ? 'none' : '';
    node.element.style.display = newDisplay;
    setTree([...tree]);
  };

  const handleNodeClick = (node: TreeNode, e: React.MouseEvent) => {
    e.stopPropagation();

    const selection: SelectedElement = {
      id: node.id,
      element: node.element,
      tagName: node.tagName,
      isImage: node.tagName === 'img',
      isText: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span', 'div'].includes(node.tagName),
    };

    if (e.shiftKey) {
      const isAlreadySelected = selectedElements.some(el => el.id === selection.id);
      if (isAlreadySelected) {
        onMultiSelect(selectedElements.filter(el => el.id !== selection.id));
      } else {
        onMultiSelect([...selectedElements, selection]);
      }
    } else {
      onSelect(selection);
      onMultiSelect([]);
    }
  };

  const renderNode = (node: TreeNode, level: number = 0): JSX.Element => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = selectedElement?.id === node.id || selectedElements.some(el => el.id === node.id);
    const isMultiSelected = selectedElements.some(el => el.id === node.id);

    return (
      <div key={node.id}>
        <div
          className={`flex items-center gap-2 py-1 px-2 cursor-pointer hover:bg-slate-700 rounded transition-colors ${
            isSelected ? (isMultiSelected ? 'bg-emerald-600' : 'bg-blue-600') : ''
          }`}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={(e) => handleNodeClick(node, e)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(node.id);
              }}
              className="p-0 hover:bg-slate-600 rounded"
              aria-label={isExpanded ? 'Collapse element' : 'Expand element'}
              aria-expanded={isExpanded}
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          )}
          {!hasChildren && <div className="w-4" />}

          <span className="flex-1 text-sm font-mono">
            {node.tagName}
            {node.id && <span className="text-slate-400 ml-1">#{node.id}</span>}
          </span>

          <button
            onClick={(e) => toggleVisibility(node, e)}
            className="p-1 hover:bg-slate-600 rounded"
            title={node.visible ? 'Hide element' : 'Show element'}
            aria-label={node.visible ? 'Hide element' : 'Show element'}
          >
            {node.visible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-slate-900 text-white border-l border-slate-700 flex flex-col h-full" role="complementary" aria-label="Element tree navigation">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-sm font-semibold">Element Tree</h3>
        <p className="text-xs text-slate-400 mt-1">
          Shift+Click for multi-select
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2">
          {tree.length === 0 ? (
            <div className="text-sm text-slate-400 text-center py-4">
              No elements yet
            </div>
          ) : (
            tree.map(node => renderNode(node))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
