import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button, TextInput, TextArea } from '@krds-ui/core';
import { discussionRoomAPI } from '../../../services/api';

interface CreateRoomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const REGIONS = [
  { value: 'BUCHEON', label: '부천시' },
  { value: 'SUWON', label: '수원시' },
  { value: 'SEONGNAM', label: '성남시' },
  { value: 'ANYANG', label: '안양시' },
  { value: 'YONGIN', label: '용인시' },
  { value: 'GWANGMYEONG', label: '광명시' },
  { value: 'GWACHEON', label: '과천시' },
  { value: 'PYEONGTAEK', label: '평택시' },
  { value: 'GWANGJU', label: '광주시' },
  { value: 'NAMYANGJU', label: '남양주시' },
];

const ACCESS_LEVELS = [
  { value: 'PUBLIC', label: '공개' },
  { value: 'PRIVATE', label: '비공개' },
];

export function CreateRoomDialog({ isOpen, onClose, onSuccess }: CreateRoomDialogProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    region: '',
    accessLevel: 'PUBLIC',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    } else if (formData.title.length < 5) {
      newErrors.title = '제목은 최소 5자 이상이어야 합니다';
    }

    if (!formData.description.trim()) {
      newErrors.description = '설명을 입력해주세요';
    } else if (formData.description.length < 10) {
      newErrors.description = '설명은 최소 10자 이상이어야 합니다';
    }

    if (!formData.region) {
      newErrors.region = '지역을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await discussionRoomAPI.createRoom(formData);

      if (response.code === 'SUCCESS') {
        alert('논의방이 성공적으로 생성되었습니다');
        handleClose();
        onSuccess?.();
      } else {
        alert(response.message || '논의방 생성에 실패했습니다');
      }
    } catch (error) {
      console.error('Failed to create room:', error);
      alert('논의방 생성 중 오류가 발생했습니다');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      region: '',
      accessLevel: 'PUBLIC',
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>새 토의실 생성</DialogTitle>
          <DialogDescription>
            지역 문제를 함께 논의할 토의실을 만들어보세요
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* 제목 */}
          <div>
            <TextInput
              id="room-title"
              title="제목"
              placeholder="토의실 제목을 입력하세요 (최소 5자)"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              length="full"
              maxLength={100}
            />
          </div>

          {/* 지역 선택 */}
          <div>
            <label htmlFor="room-region" className="block text-sm font-medium text-gray-700 mb-2">
              지역 <span className="text-danger-50">*</span>
            </label>
            <select
              id="room-region"
              value={formData.region}
              onChange={(e) => {
                setFormData({ ...formData, region: e.target.value });
                if (errors.region) {
                  setErrors({ ...errors, region: '' });
                }
              }}
              className={`
                w-full px-4 py-2.5 
                bg-gray-0 border rounded-lg
                text-gray-90 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-50
                disabled:bg-gray-10 disabled:cursor-not-allowed
                ${errors.region ? 'border-danger-50' : 'border-gray-30'}
              `}
            >
              <option value="">지역을 선택하세요</option>
              {REGIONS.map((region) => (
                <option key={region.value} value={region.value}>
                  {region.label}
                </option>
              ))}
            </select>
            {errors.region && (
              <p className="text-sm text-danger-50 mt-1">{errors.region}</p>
            )}
          </div>

          {/* 공개 설정 */}
          <div>
            <label htmlFor="room-access" className="block text-sm font-medium text-gray-700 mb-2">
              공개 설정
            </label>
            <select
              id="room-access"
              value={formData.accessLevel}
              onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
              className="
                w-full px-4 py-2.5 
                bg-gray-0 border border-gray-30 rounded-lg
                text-gray-90 text-sm
                focus:outline-none focus:ring-2 focus:ring-primary-50
              "
            >
              {ACCESS_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          {/* 설명 */}
          <div>
            <TextArea
              id="room-description"
              title="설명"
              placeholder="토의실에서 논의할 내용을 자세히 설명해주세요 (최소 10자)"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              size="large"
              maxLength={500}
              rows={6}
            />
            {errors.description && (
              <p className="text-sm text-danger-50 mt-1">{errors.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {formData.description.length} / 500
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '생성하기'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}