import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

interface DashboardExportOptions {
  title: string
  orientation?: 'portrait' | 'landscape'
  format?: 'a4' | 'letter'
  includeCharts?: boolean
  includeMetadata?: boolean
  quality?: number
}

export class DashboardPDFExporter {
  private pdf: jsPDF

  constructor(options: DashboardExportOptions) {
    this.pdf = new jsPDF({
      orientation: options.orientation || 'landscape',
      unit: 'mm',
      format: options.format || 'a4'
    })
  }

  async exportDashboard(
    dashboardElement: HTMLElement,
    options: DashboardExportOptions
  ): Promise<Blob> {
    const { title, includeMetadata = true, quality = 0.95 } = options

    // Add title page
    this.addTitlePage(title)

    // Add metadata if requested
    if (includeMetadata) {
      this.addMetadataPage({
        generatedAt: new Date().toISOString(),
        generatedBy: 'Dragonfly26.00',
        dashboardName: title
      })
    }

    // Capture dashboard as image
    const canvas = await html2canvas(dashboardElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })

    const imgData = canvas.toDataURL('image/jpeg', quality)
    const imgWidth = this.pdf.internal.pageSize.getWidth() - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    // Add dashboard image
    this.pdf.addPage()
    this.pdf.addImage(imgData, 'JPEG', 10, 10, imgWidth, imgHeight)

    // Return PDF as blob
    return this.pdf.output('blob')
  }

  async exportWidget(
    widgetElement: HTMLElement,
    widgetTitle: string
  ): Promise<void> {
    const canvas = await html2canvas(widgetElement, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const imgWidth = this.pdf.internal.pageSize.getWidth() - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    this.pdf.addPage()
    this.pdf.setFontSize(16)
    this.pdf.text(widgetTitle, 10, 15)
    this.pdf.addImage(imgData, 'PNG', 10, 25, imgWidth, imgHeight)
  }

  private addTitlePage(title: string): void {
    this.pdf.setFontSize(24)
    this.pdf.text(title, 105, 148, { align: 'center' })
    
    this.pdf.setFontSize(12)
    this.pdf.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      105,
      160,
      { align: 'center' }
    )
  }

  private addMetadataPage(metadata: Record<string, string>): void {
    this.pdf.addPage()
    this.pdf.setFontSize(16)
    this.pdf.text('Dashboard Information', 10, 20)
    
    this.pdf.setFontSize(12)
    let yPos = 35
    
    Object.entries(metadata).forEach(([key, value]) => {
      this.pdf.text(`${key}: ${value}`, 10, yPos)
      yPos += 10
    })
  }

  save(filename: string): void {
    this.pdf.save(filename)
  }

  getBlob(): Blob {
    return this.pdf.output('blob')
  }
}

// Helper function for quick export
export async function exportDashboardToPDF(
  dashboardElement: HTMLElement,
  options: DashboardExportOptions
): Promise<Blob> {
  const exporter = new DashboardPDFExporter(options)
  return await exporter.exportDashboard(dashboardElement, options)
}
