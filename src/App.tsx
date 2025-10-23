import Typography from './components/Typography'
import { Button } from '@krds-ui/core'

export default function App() {
  return (
    <>
      <Typography variant="display" size="large">
        대한민국 전자정부 사이트 예제입니다.
      </Typography>
      <Button
        onClick={function ra(){}}
        variant="primary"
      >
        버튼: Primary
      </Button>
    </>
  )
}
