<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'

  interface Props {
    cellSize?: number
    rippleDistance?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    cellSize: 56,
    rippleDistance: 200,
  })

  interface Cell {
    id: number
    row: number
    col: number
    x: number
    y: number
    opacity: number
    ripple: boolean
    animationProgress: number
  }

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  const cells = ref<Cell[]>([])
  const mousePos = ref({ x: -1000, y: -1000 })
  const clickedCell = ref<{ row: number; col: number } | null>(null)
  const animationId = ref<number | null>(null)

  const RIPPLE_SPEED = 0.05
  const BASE_OPACITY = 0.02
  const MAX_OPACITY = 0.4

  const initCells = () => {
    if (!canvasRef.value) return

    const canvas = canvasRef.value
    const cols = Math.ceil(canvas.width / props.cellSize)
    const rows = Math.ceil(canvas.height / props.cellSize)

    cells.value = []
    let id = 0

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.value.push({
          id: id++,
          row,
          col,
          x: col * props.cellSize,
          y: row * props.cellSize,
          opacity: BASE_OPACITY,
          ripple: false,
          animationProgress: 0,
        })
      }
    }
  }

  const handleResize = () => {
    if (!canvasRef.value) return

    canvasRef.value.width = window.innerWidth
    canvasRef.value.height = window.innerHeight
    initCells()
  }

  const handleMouseMove = (e: MouseEvent) => {
    mousePos.value = { x: e.clientX, y: e.clientY }
    if (animationId.value === null) {
      animationId.value = requestAnimationFrame(animate)
    }
  }

  const handleMouseLeave = () => {
    mousePos.value = { x: -1000, y: -1000 }
  }

  const handleClick = (e: MouseEvent) => {
    const col = Math.floor(e.clientX / props.cellSize)
    const row = Math.floor(e.clientY / props.cellSize)
    clickedCell.value = { row, col }

    // Reset animation for all cells
    cells.value.forEach((cell) => {
      cell.animationProgress = 0
    })

    if (animationId.value === null) {
      animationId.value = requestAnimationFrame(animate)
    }
  }

  const animate = () => {
    if (!canvasRef.value) {
      animationId.value = null
      return
    }

    const ctx = canvasRef.value.getContext('2d')
    if (!ctx) {
      animationId.value = null
      return
    }

    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    let needsUpdate = false

    cells.value.forEach((cell) => {
      const centerX = cell.x + props.cellSize / 2
      const centerY = cell.y + props.cellSize / 2

      // Mouse hover effect
      const dx = mousePos.value.x - centerX
      const dy = mousePos.value.y - centerY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Click ripple effect
      let clickInfluence = 0
      if (clickedCell.value) {
        const clickCenterX =
          clickedCell.value.col * props.cellSize + props.cellSize / 2
        const clickCenterY =
          clickedCell.value.row * props.cellSize + props.cellSize / 2
        const clickDx = centerX - clickCenterX
        const clickDy = centerY - clickCenterY
        const clickDistance = Math.sqrt(clickDx * clickDx + clickDy * clickDy)

        if (cell.animationProgress < 1) {
          cell.animationProgress += 0.02
          const rippleRadius = cell.animationProgress * props.rippleDistance * 2
          const rippleWidth = 80

          if (Math.abs(clickDistance - rippleRadius) < rippleWidth) {
            const proximity =
              1 - Math.abs(clickDistance - rippleRadius) / rippleWidth
            clickInfluence = proximity * (1 - cell.animationProgress)
          }
        }
      }

      // Hover effect
      if (distance < props.rippleDistance) {
        const influence = 1 - distance / props.rippleDistance
        const targetOpacity = BASE_OPACITY + influence * MAX_OPACITY
        cell.opacity = Math.max(cell.opacity, targetOpacity)
        cell.ripple = true
      } else {
        if (cell.ripple) {
          cell.opacity = Math.max(BASE_OPACITY, cell.opacity - RIPPLE_SPEED)
          if (cell.opacity <= BASE_OPACITY) {
            cell.ripple = false
          }
        }
      }

      // Apply click influence
      if (clickInfluence > 0) {
        cell.opacity = Math.max(
          cell.opacity,
          BASE_OPACITY + clickInfluence * MAX_OPACITY,
        )
      }

      // Draw cell border
      ctx.strokeStyle = '#22c55e'
      ctx.lineWidth = 0.5
      ctx.globalAlpha = cell.opacity
      ctx.strokeRect(cell.x, cell.y, props.cellSize, props.cellSize)

      // Draw cell fill
      ctx.fillStyle = '#22c55e'
      ctx.globalAlpha = cell.opacity * 0.3
      ctx.fillRect(cell.x, cell.y, props.cellSize, props.cellSize)

      if (
        distance < props.rippleDistance ||
        cell.ripple ||
        cell.opacity > BASE_OPACITY ||
        (clickedCell.value && cell.animationProgress < 1)
      ) {
        needsUpdate = true
      }
    })

    if (needsUpdate) {
      animationId.value = requestAnimationFrame(animate)
    } else {
      animationId.value = null
    }
  }

  onMounted(() => {
    if (canvasRef.value) {
      handleResize()
      window.addEventListener('resize', handleResize)
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseleave', handleMouseLeave)
      window.addEventListener('click', handleClick)

      // Initial render only, will pause until interaction
      if (animationId.value === null) {
        animationId.value = requestAnimationFrame(animate)
      }
    }
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseleave', handleMouseLeave)
    window.removeEventListener('click', handleClick)
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  })
</script>

<template>
  <canvas
    ref="canvasRef"
    class="fixed inset-0 z-0 cursor-pointer"
    :class="$attrs.class"
  />
</template>
