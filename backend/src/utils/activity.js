export function activityFromDocuments({ certifications, organizations, inquiries }) {
  return [
    ...certifications.map((item) => ({
      type: "Certification",
      title: item.name,
      status: item.status,
      createdAt: item.createdAt
    })),
    ...organizations.map((item) => ({
      type: "Organization",
      title: item.title,
      status: item.status,
      createdAt: item.createdAt
    })),
    ...inquiries.map((item) => ({
      type: "Inquiry",
      title: `${item.name} - ${item.source}`,
      status: item.status,
      createdAt: item.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);
}
