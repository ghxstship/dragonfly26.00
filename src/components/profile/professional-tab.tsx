"use client"

import { useState, useEffect } from "react"
import { useTranslations } from "next-intl"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {Save, Plus, Trash2, Loader2} from "lucide-react"
import { useToast } from "@/lib/hooks/use-toast"

interface Experience {
  id: string
  title: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  degree: string
  institution: string
  fieldOfStudy: string
  graduationYear: string
}

export function ProfessionalTab() {
  const t = useTranslations()
  const { profile, loading, updateProfile } = useProfileData()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const [professionalData, setProfessionalData] = useState({
    title: "",
    bio: "",
    company: "",
    department: "",
    portfolioUrl: "",
  })

  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])

  // Sync with profile data
  useEffect(() => {
    if (profile) {
      setProfessionalData({
        title: profile.job_title || "",
        bio: profile.bio || "",
        company: profile.company || "",
        department: profile.department || "",
        portfolioUrl: profile.website_url || "",
      })
      setExperiences(profile.work_experience || [])
      setEducation(profile.education || [])
    }
  }, [profile])

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperiences([...experiences, newExp])
  }

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((e: any) => (e as any).id !== id))
  }

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    setExperiences(
      experiences.map((exp: any) => (exp.id === id ? { ...exp, [field]: value } : exp))
    )
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      fieldOfStudy: "",
      graduationYear: "",
    }
    setEducation([...education, newEdu])
  }

  const removeEducation = (id: string) => {
    setEducation(education.filter((e: any) => (e as any).id !== id))
  }

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setEducation(
      education.map((edu: any) => (edu.id === id ? { ...edu, [field]: value } : edu))
    )
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateProfile({
        job_title: professionalData.title,
        bio: professionalData.bio,
        company: professionalData.company,
        department: professionalData.department,
        website_url: professionalData.portfolioUrl,
        work_experience: experiences,
        education: education,
      })
      
      toast({
        title: t('profile.success.professionalUpdated'),
        description: t('profile.success.professionalSaved'),
      })
    } catch (error: Error | unknown) {
      toast({
        title: t('profile.errors.error'),
        description: (error as any).message,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-wrap items-center justify-center h-48 md:h-56 lg:h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-3 md:space-y-4 lg:space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('profile.professional.summary')}</CardTitle>
          <CardDescription>{t('profile.professional.headline')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('profile.professional.title')}</Label>
            <Input
              id="title"
              value={professionalData.title}
              onChange={(e) => setProfessionalData({ ...professionalData, title: e.target.value })}
              placeholder={t('profile.professional.titlePlaceholder')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">{t('profile.professional.company')}</Label>
              <Input
                id="company"
                value={professionalData.company}
                onChange={(e) =>
                  setProfessionalData({ ...professionalData, company: e.target.value })
                }
                placeholder={t('profile.professional.companyPlaceholder')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">{t('profile.professional.department')}</Label>
              <Input
                id="department"
                value={professionalData.department}
                onChange={(e) =>
                  setProfessionalData({ ...professionalData, department: e.target.value })
                }
                placeholder={t('profile.professional.departmentPlaceholder')}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">{t('profile.professional.bio')}</Label>
            <Textarea
              id="bio"
              value={professionalData.bio}
              onChange={(e) => setProfessionalData({ ...professionalData, bio: e.target.value })}
              placeholder={t('profile.professional.bioPlaceholder')}
              rows={6}
            />
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>{t('profile.professional.workExperience')}</CardTitle>
              <CardDescription>{t('profile.professional.workHistory')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addExperience}>
              <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
              {t('profile.professional.addExperience')}
            </Button>
          </div>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-3 md:space-y-4 lg:space-y-6">
          {experiences.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 md:py-6 lg:py-8">
              {t('profile.professional.noExperience')}
            </p>
          ) : (
            experiences.map((exp: any) => (
              <div key={exp.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{t('profile.professional.experienceEntry')}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExperience(exp.id)}
                    aria-label="Remove work experience"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${exp.id}`}>{t('profile.professional.jobTitle')}</Label>
                    <Input
                      id={`title-${exp.id}`}
                      value={exp.title}
                      onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                      placeholder={t('profile.professional.jobTitlePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${exp.id}`}>{t('profile.professional.company')}</Label>
                    <Input
                      id={`company-${exp.id}`}
                      value={exp.company}
                      onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                      placeholder={t('profile.professional.companyPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 md:grid-cols-2 md:grid-cols-2 lg:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`location-${exp.id}`}>{t('profile.professional.location')}</Label>
                    <Input
                      id={`location-${exp.id}`}
                      value={exp.location}
                      onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                      placeholder={t('profile.professional.locationPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${exp.id}`}>{t('profile.professional.startDate')}</Label>
                    <Input
                      id={`startDate-${exp.id}`}
                      type="month"
                      value={exp.startDate}
                      onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${exp.id}`}>
                      {exp.current ? t('profile.professional.current') : t('profile.professional.endDate')}
                    </Label>
                    <Input
                      id={`endDate-${exp.id}`}
                      type="month"
                      value={exp.endDate}
                      onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                      disabled={exp.current}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap md:flex-nowrap items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`current-${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => updateExperience(exp.id, "current", e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor={`current-${exp.id}`} className="font-normal">
                    {t('profile.professional.currentlyWorking')}
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`description-${exp.id}`}>{t('profile.professional.description')}</Label>
                  <Textarea
                    id={`description-${exp.id}`}
                    value={exp.description}
                    onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                    placeholder={t('profile.professional.descriptionPlaceholder')}
                    rows={4}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap flex-col sm:flex-row flex-col md:flex-row items-center justify-between">
            <div>
              <CardTitle>{t('profile.professional.education')}</CardTitle>
              <CardDescription>{t('profile.professional.educationBackground')}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={addEducation}>
              <Plus aria-hidden="true" className="h-4 w-4 mr-2" />
              {t('profile.professional.addEducation')}
            </Button>
          </div>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-3 md:space-y-4 lg:space-y-6">
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 md:py-6 lg:py-8">
              {t('profile.professional.noEducation')}
            </p>
          ) : (
            education.map((edu: any) => (
              <div key={edu.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="font-semibold">{t('profile.professional.educationEntry')}</h4>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeEducation(edu.id)}
                    aria-label="Remove education entry"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${edu.id}`}>{t('profile.professional.degree')}</Label>
                    <Input
                      id={`degree-${edu.id}`}
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                      placeholder={t('profile.professional.degreePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${edu.id}`}>{t('profile.professional.institution')}</Label>
                    <Input
                      id={`institution-${edu.id}`}
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                      placeholder={t('profile.professional.institutionPlaceholder')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 lg:gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`field-${edu.id}`}>{t('profile.professional.fieldOfStudy')}</Label>
                    <Input
                      id={`field-${edu.id}`}
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateEducation(edu.id, "fieldOfStudy", e.target.value)}
                      placeholder={t('profile.professional.fieldPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gradYear-${edu.id}`}>{t('profile.professional.graduationYear')}</Label>
                    <Input
                      id={`gradYear-${edu.id}`}
                      type="number"
                      value={edu.graduationYear}
                      onChange={(e) => updateEducation(edu.id, "graduationYear", e.target.value)}
                      placeholder={t('profile.professional.yearPlaceholder')}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('profile.professional.portfolio')}</CardTitle>
          <CardDescription>{t('profile.professional.portfolioWebsite')}</CardDescription>
        </CardHeader>
        <CardContent aria-hidden="true" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="portfolio">{t('profile.professional.portfolioUrl')}</Label>
            <Input
              id="portfolio"
              type="url"
              value={professionalData.portfolioUrl}
              onChange={(e) =>
                setProfessionalData({ ...professionalData, portfolioUrl: e.target.value })
              }
              placeholder={t('profile.professional.portfolioUrlPlaceholder')}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save aria-hidden="true" className="h-4 w-4 mr-2" />
          )}
          {t('profile.actions.saveChanges')}
        </Button>
      </div>
    </div>
  )
}
