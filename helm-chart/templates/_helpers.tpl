{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "application.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}
 
{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "application.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}
 
{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "application.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}
 
{{/*
Common labels
*/}}
{{- define "application.labels" -}}
app.kubernetes.io/name: {{ include "application.name" . }}
helm.sh/chart: {{ include "application.chart" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end -}}
 
{{/*
build one ingress host as: ci_project_name || project_alias[-suffix].environment  - except if is disabled for prod
*/}}
{{- define "application.ingress.host" -}}
{{- $name := include "application.name" . -}}
{{- $alias := .Values.projectAlias -}}
{{- if .Values.ingress.environment.disabledInProd -}}
{{- if eq .Values.ingress.host.environment "prod" -}}
{{- if $alias -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.domain) | replace $name $alias }}
{{- else -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.domain) }}
{{- end }}
{{- else -}}
{{- if $alias -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.environment "." .Values.ingress.host.domain)  | replace $name $alias }}
{{- else -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.environment "." .Values.ingress.host.domain) }}
{{- end }}
{{- end }}
{{- else -}}
{{- if $alias -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.environment "." .Values.ingress.host.domain)  | replace $name $alias }}
{{- else -}}
{{ (print .Values.ingress.host.applicationName "." .Values.ingress.host.environment "." .Values.ingress.host.domain) }}
{{- end }}
{{- end }}
{{- end -}}