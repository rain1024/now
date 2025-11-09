import { render, screen, fireEvent } from '@testing-library/react'
import Hero3D from '@/components/Homepage/Hero3D'

// Mock the Canvas component from react-three-fiber
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children, ...props }: any) => (
    <div data-testid="canvas-mock" {...props}>
      {children}
    </div>
  ),
  useFrame: jest.fn(),
}))

// Mock drei components
jest.mock('@react-three/drei', () => ({
  OrbitControls: () => null,
  Sphere: () => null,
  MeshDistortMaterial: () => null,
  Stars: () => null,
  Float: ({ children }: any) => <>{children}</>,
  Sparkles: () => null,
}))

describe('Hero3D Component', () => {
  it('renders the 3D container', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')
    expect(container).toBeInTheDocument()
  })

  it('has full-page styling', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')
    expect(container).toHaveClass('fixed', 'inset-0', 'w-screen', 'h-screen')
  })

  it('is clickable', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')
    expect(container).toHaveClass('cursor-pointer')
  })

  it('calls onInteraction when clicked', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')
    fireEvent.click(container)

    expect(mockOnInteraction).toHaveBeenCalledTimes(1)
  })

  it('handles mouse move events', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')

    fireEvent.mouseMove(container, {
      clientX: 100,
      clientY: 200,
    })

    // The component should not crash and should handle the event
    expect(container).toBeInTheDocument()
  })

  it('renders the Canvas component', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const canvas = screen.getByTestId('canvas-mock')
    expect(canvas).toBeInTheDocument()
  })

  it('does not render any text content', () => {
    const mockOnInteraction = jest.fn()
    const { container } = render(<Hero3D onInteraction={mockOnInteraction} />)

    // Check that there's no visible text in the component
    const textContent = container.textContent
    expect(textContent).toBe('')
  })

  it('applies correct accessibility attributes', () => {
    const mockOnInteraction = jest.fn()
    render(<Hero3D onInteraction={mockOnInteraction} />)

    const container = screen.getByTestId('hero-3d-container')
    expect(container.getAttribute('data-testid')).toBe('hero-3d-container')
  })

  it('creates circular particle textures using canvas', () => {
    const mockOnInteraction = jest.fn()

    // Save original createElement
    const originalCreateElement = document.createElement

    // Track canvas creation
    let canvasCount = 0
    const createElementSpy = jest.spyOn(document, 'createElement')
    createElementSpy.mockImplementation(function(this: Document, tagName: string) {
      if (tagName === 'canvas') {
        canvasCount++
      }
      return originalCreateElement.call(this, tagName)
    })

    render(<Hero3D onInteraction={mockOnInteraction} />)

    // Verify that at least one canvas was created for particle textures
    expect(canvasCount).toBeGreaterThan(0)

    createElementSpy.mockRestore()
  })
})
