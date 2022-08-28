import React, { useEffect, useRef } from 'react'

interface BarChartData {
    label: string;
    value: number;
}

interface BarChartProps {
    element?: HTMLCanvasElement | null;
    data: BarChartData[];
    width?: string;
    height?: string;
    isDarkMode?: boolean;
    showValue?: boolean;
    showYIndicatorLines?: boolean;
    lineColor?: string;
    barColor?: string;
    textColor?: string;
    increamentY?: number;
    barWidth?: number;
}

export default function BarChart({ width, height, ...props }: BarChartProps) {

    const renderChart = (option: BarChartProps) => {
        const { element, data } = option // required options
        var canvas = element, ctx: CanvasRenderingContext2D

        if (!canvas) {
            throw new Error("Element not found")
        }
        if (!data) {
            throw new Error("Data not found")
        }
        try {
            var context = canvas.getContext("2d")
            if (context == null) return
            canvas.style.margin = "1px"
            ctx = context
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } catch (err) {
            throw new Error("Element is not a canvas")
        }
        var maxData = Math.max(...data.map(d => d.value)), leftIndent = (maxData + "").length * 17,
            curX = leftIndent, width = canvas.width - 10, height = maxData + 50

        // optional options
        var isDarkMode = typeof option?.isDarkMode == "boolean" ? option?.isDarkMode : false,
            showValue = typeof option?.showValue == "boolean" ? option?.showValue : true,
            showYIndicatorLines = typeof option?.showYIndicatorLines == "boolean" ? option?.showYIndicatorLines : true,
            lineColor = option?.lineColor || (isDarkMode ? "#fff" : "#000"),
            barColor = option?.barColor || (isDarkMode ? "purple" : "navy"),
            textColor = option?.textColor || (isDarkMode ? "#fff" : "#000"),
            increamentValue = option?.increamentY || 50,
            barWidth = option?.barWidth || 30

        //drawing lines
        ctx.beginPath()
        ctx.moveTo(leftIndent - 2, 0)
        ctx.lineTo(leftIndent - 2, height)
        ctx.lineTo(width, height)
        ctx.strokeStyle = lineColor
        ctx.stroke()

        // drawing bars and writing text
        ctx.font = "12px Arial";
        ctx.textAlign = "left"
        curX = leftIndent
        data.forEach(d => {
            ctx.fillStyle = barColor
            ctx.fillRect(curX, height - d.value, barWidth, d.value)
            ctx.fillStyle = textColor
            if (showValue) ctx.fillText(d.value + "", curX + 5, height - d.value - 5);
            ctx.fillText(d.label, curX, height + 15);
            curX += barWidth + 2
        })

        // writing Y values or ranges
        ctx.textAlign = "right"
        const YIndicatorLineColor = isDarkMode ? "rgb(255, 255, 255, .05)" : "rgb(0, 0, 0, .03)"
        Array.from({ length: height / increamentValue + 1 }, (_, i) => i * increamentValue).forEach(d => {
            ctx.fillText(d + "-", leftIndent - 3, height - d + 3);
            if (showYIndicatorLines) {
                ctx.moveTo(leftIndent - 2, height - d)
                ctx.lineTo(width, height - d)
                ctx.strokeStyle = YIndicatorLineColor
                ctx.stroke()
            }
        })
    }

    const canvasElement = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        if (canvasElement && Array.isArray(props.data) && props.data.length) {
            renderChart({
                element: canvasElement.current,
                ...props
            })
        }
    }, [props, canvasElement])

    return (
        <canvas ref={canvasElement}  width={width || "300"} height={height || "300"}></canvas>
    )
}
