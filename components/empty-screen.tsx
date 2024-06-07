import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="flex flex-col gap-2 rounded-lg border bg-background p-8">
        <h1 className="text-lg font-semibold">
          Chào mừng bạn
        </h1>
        <p className="leading-normal text-muted-foreground">
          Chúng tôi rất vui mừng chào đón bạn đến với ứng dụng học Anh văn nâng cao khả năng giao tiếp. Dưới đây là một số hướng dẫn để bạn bắt đầu sử dụng ứng dụng:{' '}<br></br>
        </p>
        <p className="leading-normal text-muted-foreground">
          Ví Dụ Nhận Dạng Giọng Nói:<br></br>
          Nhấn nút có biểu tượng Microphone bên dưới và Nói: &quot;Hot news in Vietnam?&quot;. Nhấn lần nữa để tắt Mic.<br></br>
          
          Ví Dụ Tương Tác Văn Bản:<br></br>
          Nhập: &quot;Luyện ngữ pháp Thì Hiện tại hoàn thành.&quot;<br></br>
          
        </p>
      </div>
    </div>
  )
}
