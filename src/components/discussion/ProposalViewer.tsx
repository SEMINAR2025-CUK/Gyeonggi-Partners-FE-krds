import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';
import { Button } from '@krds-ui/core';
import { X, FileText } from 'lucide-react';
import { Proposal } from '../../types/discussion';

interface ProposalViewerProps {
  proposal: Proposal | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProposalViewer = ({ proposal, isOpen, onClose }: ProposalViewerProps) => {
  if (!proposal) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING_CONSENT: { label: '승인 대기', color: 'bg-yellow-100 text-yellow-800' },
      APPROVED: { label: '승인됨', color: 'bg-green-100 text-green-800' },
      REJECTED: { label: '거부됨', color: 'bg-red-100 text-red-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING_CONSENT;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 flex-1">
            <FileText size={24} className="text-blue-600" />
            <DialogTitle className="text-xl font-bold text-gray-900">
              제안서 상세보기
            </DialogTitle>
          </div>
          <Button
            variant="tertiary"
            size="small"
            onClick={onClose}
            children={<X size={20} />}
          />
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-140px)]">
          {/* Title and Status */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h2 className="text-2xl font-bold text-gray-900 flex-1">
                {proposal.title || '제목 없음'}
              </h2>
              {getStatusBadge(proposal.status)}
            </div>

            {/* Metadata */}
            <div className="flex gap-4 text-sm text-gray-600">
              {proposal.createdAt && (
                <div>
                  <span className="font-medium">작성일:</span>{' '}
                  {new Date(proposal.createdAt).toLocaleDateString('ko-KR')}
                </div>
              )}
              {proposal.updatedAt && proposal.updatedAt !== proposal.createdAt && (
                <div>
                  <span className="font-medium">수정일:</span>{' '}
                  {new Date(proposal.updatedAt).toLocaleDateString('ko-KR')}
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 my-6"></div>

          {/* HTML Content */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: proposal.content || '<p>내용이 없습니다.</p>' }}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            variant="secondary"
            size="medium"
            onClick={onClose}
          >
            닫기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
