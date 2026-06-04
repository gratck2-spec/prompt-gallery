import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FollowButton } from '@/components/follow-button'

describe('FollowButton', () => {
  it('renders follow text when not following', () => {
    render(<FollowButton isFollowing={false} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: /follow/i })).toBeInTheDocument()
  })

  it('renders unfollow text when following', () => {
    render(<FollowButton isFollowing={true} onToggle={vi.fn()} />)
    expect(screen.getByRole('button', { name: /unfollow/i })).toBeInTheDocument()
  })

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<FollowButton isFollowing={false} onToggle={onToggle} />)
    
    await user.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledTimes(1)
  })

  it('calls onToggle with correct state when toggling', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<FollowButton isFollowing={false} onToggle={onToggle} />)
    
    await user.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledWith(true)
  })

  it('calls onToggle with false when unfollowing', async () => {
    const user = userEvent.setup()
    const onToggle = vi.fn()
    render(<FollowButton isFollowing={true} onToggle={onToggle} />)
    
    await user.click(screen.getByRole('button'))
    expect(onToggle).toHaveBeenCalledWith(false)
  })

  it('is disabled when loading', () => {
    render(<FollowButton isFollowing={false} onToggle={vi.fn()} isLoading={true} />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<FollowButton isFollowing={false} onToggle={vi.fn()} isLoading={true} />)
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true')
  })
})
