'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  StarIcon, 
  GiftIcon, 
  TrophyIcon, 
  SparklesIcon,
  ArrowUpIcon,
  ClockIcon 
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface LoyaltyData {
  id: number
  user_id: number
  tier_id: number
  current_points: number
  total_points: number
  tier_name: string
  benefits: string
  discount_percentage: number
  free_shipping_threshold: number
  early_access: boolean
}

interface PointTransaction {
  id: number
  points: number
  transaction_type: string
  description: string
  created_at: string
}

interface LoyaltyReward {
  id: number
  name: string
  description: string
  required_points: number
  reward_type: string
  reward_value: number
  is_active: boolean
}

interface NextTier {
  id: number
  name: string
  min_points: number
  discount_percentage: number
  benefits: string
}

export default function LoyaltyDashboard() {
  const router = useRouter()
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [pointHistory, setPointHistory] = useState<PointTransaction[]>([])
  const [availableRewards, setAvailableRewards] = useState<LoyaltyReward[]>([])
  const [nextTier, setNextTier] = useState<NextTier | null>(null)
  const [pointsToNextTier, setPointsToNextTier] = useState(0)
  const [loading, setLoading] = useState(true)
  const [redeeming, setRedeeming] = useState<number | null>(null)

  useEffect(() => {
    fetchLoyaltyData()
  }, [])

  const fetchLoyaltyData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login?redirect=/loyalty')
        return
      }

      const response = await fetch('/api/loyalty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch loyalty data')
      }

      const data = await response.json()
      setLoyaltyData(data.loyalty)
      setPointHistory(data.pointHistory || [])
      setAvailableRewards(data.availableRewards || [])
      setNextTier(data.nextTier)
      setPointsToNextTier(data.pointsToNextTier || 0)

    } catch (error) {
      console.error('Error fetching loyalty data:', error)
    } finally {
      setLoading(false)
    }
  }

  const redeemReward = async (rewardId: number) => {
    setRedeeming(rewardId)
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/loyalty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'redeem_reward',
          reward_id: rewardId
        })
      })

      if (response.ok) {
        const result = await response.json()
        alert(`${result.reward} redeemed successfully!`)
        fetchLoyaltyData() // Refresh data
      } else {
        const error = await response.json()
        alert(error.message || 'Failed to redeem reward')
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
      alert('Failed to redeem reward')
    } finally {
      setRedeeming(null)
    }
  }

  const getTierIcon = (tierName: string) => {
    switch (tierName?.toLowerCase()) {
      case 'bronze':
        return <StarIcon className="h-6 w-6 text-amber-600" />
      case 'silver':
        return <StarSolidIcon className="h-6 w-6 text-gray-500" />
      case 'gold':
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />
      case 'platinum':
        return <SparklesIcon className="h-6 w-6 text-purple-600" />
      default:
        return <StarIcon className="h-6 w-6 text-gray-400" />
    }
  }

  const getTierColor = (tierName: string) => {
    switch (tierName?.toLowerCase()) {
      case 'bronze':
        return 'from-amber-500 to-amber-600'
      case 'silver':
        return 'from-gray-400 to-gray-600'
      case 'gold':
        return 'from-yellow-400 to-yellow-600'
      case 'platinum':
        return 'from-purple-500 to-purple-700'
      default:
        return 'from-gray-400 to-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!loyaltyData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Loyalty Program</h2>
        <p className="text-gray-600">Unable to load loyalty data.</p>
      </div>
    )
  }

  const progressPercentage = nextTier 
    ? ((loyaltyData.current_points - (nextTier.min_points - pointsToNextTier)) / pointsToNextTier) * 100
    : 100

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Loyalty Program</h1>
        <p className="text-gray-600">Earn points with every purchase and unlock exclusive rewards</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier Status Card */}
        <div className="lg:col-span-2">
          <div className={`bg-gradient-to-r ${getTierColor(loyaltyData.tier_name)} rounded-lg p-6 text-white mb-6`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getTierIcon(loyaltyData.tier_name)}
                <div>
                  <h2 className="text-2xl font-bold">{loyaltyData.tier_name} Member</h2>
                  <p className="text-white/80">Current Tier</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{loyaltyData.current_points}</p>
                <p className="text-white/80">Points Available</p>
              </div>
            </div>

            {nextTier && (
              <div className="bg-white/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress to {nextTier.name}</span>
                  <span className="text-sm">{pointsToNextTier} points to go</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Benefits</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-pink-600 font-bold">%</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{loyaltyData.discount_percentage}% Discount</p>
                  <p className="text-sm text-gray-600">On all purchases</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">🚚</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders above ₹{loyaltyData.free_shipping_threshold}</p>
                </div>
              </div>

              {loyaltyData.early_access && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Early Access</p>
                    <p className="text-sm text-gray-600">To new products & sales</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <GiftIcon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Exclusive Rewards</p>
                  <p className="text-sm text-gray-600">Access to special offers</p>
                </div>
              </div>
            </div>
          </div>

          {/* Points History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            {pointHistory.length === 0 ? (
              <p className="text-gray-600 text-center py-4">No point activity yet</p>
            ) : (
              <div className="space-y-3">
                {pointHistory.map((transaction) => (
                  <div key={transaction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.description}</p>
                      <p className="text-sm text-gray-600">{formatDate(transaction.created_at)}</p>
                    </div>
                    <div className={`font-bold ${
                      transaction.points > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.points > 0 ? '+' : ''}{transaction.points} pts
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Rewards Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Rewards</h3>
            
            {availableRewards.length === 0 ? (
              <div className="text-center py-8">
                <GiftIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No rewards available yet</p>
                <p className="text-sm text-gray-500">Keep shopping to earn more points!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {availableRewards.map((reward) => (
                  <div key={reward.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{reward.name}</h4>
                        <p className="text-sm text-gray-600">{reward.description}</p>
                      </div>
                      <span className="text-lg font-bold text-pink-600">
                        {reward.required_points} pts
                      </span>
                    </div>
                    
                    <button
                      onClick={() => redeemReward(reward.id)}
                      disabled={redeeming === reward.id || loyaltyData.current_points < reward.required_points}
                      className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        loyaltyData.current_points >= reward.required_points
                          ? 'bg-pink-600 text-white hover:bg-pink-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {redeeming === reward.id ? 'Redeeming...' : 
                       loyaltyData.current_points >= reward.required_points ? 'Redeem' : 'Not enough points'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* How to Earn Points */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">How to Earn Points</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Every ₹100 spent</span>
                  <span className="font-medium">10 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Product review</span>
                  <span className="font-medium">50 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Birthday bonus</span>
                  <span className="font-medium">500 points</span>
                </div>
                <div className="flex justify-between">
                  <span>Referral bonus</span>
                  <span className="font-medium">1000 points</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}