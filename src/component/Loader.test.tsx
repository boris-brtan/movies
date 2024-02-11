import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { Loader } from './Loader'

describe('Loader component', () => {
    it('should render correctly', () => {
        render(<Loader />)

        expect(document.querySelector('.loader')).toBeVisible()
    })
})
