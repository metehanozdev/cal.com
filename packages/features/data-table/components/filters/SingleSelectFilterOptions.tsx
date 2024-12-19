"use client";

import { classNames } from "@calcom/lib";
import { useLocale } from "@calcom/lib/hooks/useLocale";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandSeparator,
  CommandGroup,
  buttonClasses,
  Icon,
} from "@calcom/ui";

import type { FilterableColumn } from "../../lib/types";
import { ZSingleSelectFilterValue } from "../../lib/types";
import { useDataTable, useFilterValue } from "../../lib/utils";

export type SingleSelectFilterOptionsProps = {
  column: Extract<FilterableColumn, { type: "single_select" }>;
};

export function SingleSelectFilterOptions({ column }: SingleSelectFilterOptionsProps) {
  const { t } = useLocale();
  const filterValue = useFilterValue(column.id, ZSingleSelectFilterValue);
  const { updateFilter, removeFilter } = useDataTable();

  return (
    <Command>
      <CommandInput placeholder={t("search_options")} />
      <CommandList>
        <CommandEmpty>{t("no_options_found")}</CommandEmpty>
        {Array.from(column.options.keys()).map((option) => {
          if (!option) return null;
          const { label: optionLabel, value: optionValue } =
            typeof option === "string" ? { label: option, value: option } : option;

          return (
            <CommandItem
              key={optionValue}
              onSelect={() => {
                updateFilter(column.id, { type: "single_select", data: optionValue });
              }}>
              <div
                className={classNames(
                  "border-subtle mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                  filterValue?.data === optionValue ? "bg-primary" : "opacity-50"
                )}>
                {filterValue?.data === optionValue && (
                  <Icon name="check" className="text-primary-foreground h-4 w-4" />
                )}
              </div>
              {optionLabel}
            </CommandItem>
          );
        })}
      </CommandList>
      <CommandSeparator />
      <CommandGroup>
        <CommandItem
          onSelect={() => {
            removeFilter(column.id);
          }}
          className={classNames("w-full justify-center text-center", buttonClasses({ color: "secondary" }))}>
          {t("clear")}
        </CommandItem>
      </CommandGroup>
    </Command>
  );
}
