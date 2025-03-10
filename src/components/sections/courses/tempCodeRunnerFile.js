
    debounceTimer.current = setTimeout(() => {
      const baseUrl = window.location.pathname;
      const q = new URLSearchParams();

      // Category
      if (!fixedCategory && selectedCategory.length > 0) {
        const catParam = selectedCategory
          .map((cat) => encodeURIComponent(cat.trim()))
          .join(",");
        if (catParam) q.set("category", catParam);
      }
      // Grade
      if (selectedGrade) {
        q.set("grade", encodeURIComponent(selectedGrade));
      }
      // Search
      if (searchTerm) {
        q.set("search", encodeURIComponent(searchTerm));
      }
      // Sort
      if (sortOrder && sortOrder !== "newest-first") {
        q.set("sort", sortOrder);
      }
      // Page
      if (currentPage > 1) {
        q.set("page", currentPage.toString());
      }

      const newQuery = q.toString();
      const newUrl = newQuery ? `${baseUrl}?${newQuery}` : baseUrl;
      const currentUrl = window.location.pathname + window.location.search;
      if (newUrl !== currentUrl) {
        router.push(newUrl, { shallow: true });
      }
    }, 300);