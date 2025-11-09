import { render, screen, fireEvent } from '@testing-library/react'
import LandingPage from '@/components/Homepage/LandingPage'

// Mock the Hero3D component
jest.mock('@/components/Homepage/Hero3D', () => {
  return function MockHero3D({ onInteraction }: { onInteraction: () => void }) {
    return (
      <div
        data-testid="mock-hero-3d"
        onClick={onInteraction}
        className="fixed inset-0 w-screen h-screen cursor-pointer"
      >
        Mock 3D Scene
      </div>
    )
  }
})

describe('LandingPage Component', () => {
  it('renders the landing page', () => {
    const mockOnLoginClick = jest.fn()
    render(<LandingPage onLoginClick={mockOnLoginClick} />)

    const landingPage = screen.getByTestId('landing-page')
    expect(landingPage).toBeInTheDocument()
  })

  it('renders the Hero3D component', () => {
    const mockOnLoginClick = jest.fn()
    render(<LandingPage onLoginClick={mockOnLoginClick} />)

    const hero3D = screen.getByTestId('mock-hero-3d')
    expect(hero3D).toBeInTheDocument()
  })

  it('passes onLoginClick to Hero3D as onInteraction', () => {
    const mockOnLoginClick = jest.fn()
    render(<LandingPage onLoginClick={mockOnLoginClick} />)

    const hero3D = screen.getByTestId('mock-hero-3d')
    fireEvent.click(hero3D)

    expect(mockOnLoginClick).toHaveBeenCalledTimes(1)
  })

  it('does not render any visible text', () => {
    const mockOnLoginClick = jest.fn()
    const { container } = render(<LandingPage onLoginClick={mockOnLoginClick} />)

    // The only text should be from the mocked Hero3D component
    expect(container.textContent).toBe('Mock 3D Scene')
  })

  it('has minimal structure (no extra UI elements)', () => {
    const mockOnLoginClick = jest.fn()
    const { container } = render(<LandingPage onLoginClick={mockOnLoginClick} />)

    // Should only have the landing-page div and Hero3D
    const landingPageDiv = container.querySelector('[data-testid="landing-page"]')
    expect(landingPageDiv?.children.length).toBe(1)
  })

  it('maintains full-page layout', () => {
    const mockOnLoginClick = jest.fn()
    render(<LandingPage onLoginClick={mockOnLoginClick} />)

    const hero3D = screen.getByTestId('mock-hero-3d')
    expect(hero3D).toHaveClass('fixed', 'inset-0', 'w-screen', 'h-screen')
  })
})
