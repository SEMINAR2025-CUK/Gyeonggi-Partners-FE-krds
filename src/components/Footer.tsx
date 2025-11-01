// src/components/Footer.tsx
import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";
import { Title, Body, Detail, Link } from '@krds-ui/core';

export function Footer() {
  return (
    <footer className="bg-gray-5 border-t border-gray-20 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 모바일일 때(360px~600px): 밑으로 정렬, 테블릿, 데스크탑일 때(601px~): 옆으로 정렬 */}
        <div className="grid gap-8 mobile:grid-cols-1 tablet:grid-cols-4 items-start">
          {/* Platform info - 2칸 차지 */}
          <div className="tablet:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary-60 rounded-md flex items-center justify-center">
                <span className="text-gray-0 font-bold text-lg">경</span>
              </div>
              <div>
                <Title size="xs" color="gray-90" className="mb-1">
                  경기 파트너스
                </Title>
                <Detail size="s" color="gray-60">
                  시민참여형 문제해결 플랫폼
                </Detail>
              </div>
            </div>
            
            <Body size="s" color="gray-60" className="mb-4 leading-relaxed">
              경기도민과 지자체가 함께 만들어가는 새로운 시민참여 플랫폼입니다. 
              단순한 문제 제기를 넘어 구체적인 해결책을 함께 모색하고 실현해나갑니다.
            </Body>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-gray-60" />
                <Detail size="s" color="gray-60">
                  경기도 수원시 영통구 도청로 30
                </Detail>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-gray-60" />
                <Detail size="s" color="gray-60">
                  031-8008-1234
                </Detail>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-gray-60" />
                <Detail size="s" color="gray-60">
                  partners@gyeonggi.go.kr
                </Detail>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <Title size="xs" color="gray-90" className="mb-4">
              빠른 메뉴
            </Title>
            <ul className="space-y-2">
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  솔루션 토의실
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  진행중인 제안
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  완료된 프로젝트
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  이용 가이드
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors"
                >
                  공지사항
                </Link>
              </li>
            </ul>
          </div>

          {/* Related sites */}
          <div>
            <Title size="xs" color="gray-90" className="mb-4">
              관련 사이트
            </Title>
            <ul className="space-y-2">
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors flex items-center"
                >
                  경기도청
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors flex items-center"
                >
                  국민신문고
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors flex items-center"
                >
                  정부민원포털
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors flex items-center"
                >
                  시민참여플랫폼
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
              <li>
                <Link 
                  size="s" 
                  color="gray-60"
                  href="#" 
                  className="hover:text-primary-60 transition-colors flex items-center"
                >
                  정보공개포털
                  <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Separator 대체 */}
        <div className="my-8 border-t border-gray-20" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-wrap items-center space-x-4 mb-4 md:mb-0">
            <Detail size="s" color="gray-50">
              © 2024 경기도청. All rights reserved.
            </Detail>
            <Link 
              size="s" 
              color="gray-50"
              href="#" 
              className="hover:text-primary-60 transition-colors"
            >
              개인정보처리방침
            </Link>
            <Link 
              size="s" 
              color="gray-50"
              href="#" 
              className="hover:text-primary-60 transition-colors"
            >
              이용약관
            </Link>
            <Link 
              size="s" 
              color="gray-50"
              href="#" 
              className="hover:text-primary-60 transition-colors"
            >
              저작권정책
            </Link>
            <Link 
              size="s" 
              color="gray-50"
              href="#" 
              className="hover:text-primary-60 transition-colors"
            >
              웹접근성
            </Link>
          </div>
          <Detail size="s" color="gray-40">
            본 사이트는 대한민국 정부의 공식 웹사이트입니다.
          </Detail>
        </div>
      </div>
    </footer>
  );
}